//
//  VideoConverter.swift
//  happyo
//
//  Created by Ilya Shalnev on 03.12.2021.
//
import Foundation
import AVFoundation
import UIKit

struct Options: Codable {

  struct Scale: Codable {
    let width: CGFloat
    let height: CGFloat
    let fps: Int
  }

  let url: URL
  let trimFrom: Int?
  let trimTo: Int?
  let scale: Scale?
  let mute: Bool?

  init(with params: [String: Any]) throws {
      self = try JSONDecoder().decode(Options.self, from: JSONSerialization.data(withJSONObject: params))
  }
}

@objc(VideoConverter)

class VideoConverter: NSObject {

  var exportSession: AVAssetExportSession!
  var videoURL: URL?
  var thumbnailURL: URL?
  var error: Error?

  let videoName = "video.mp4"
  let thumbnailName = "thumbnail.jpeg"
  let thumbnailQuality: CGFloat = 80

  let tasks = DispatchGroup()

  private func getPath(for file: String = "") -> URL? {

    let fileManager = FileManager.default
    guard var path = try? fileManager.url(
      for: .documentDirectory,
      in: .userDomainMask,
      appropriateFor: nil,
      create: true
      ) else {
      return nil
    }

    path = path.appendingPathComponent("video")

    if !fileManager.fileExists(atPath: path.path) {
      do {
        try fileManager.createDirectory(at: path, withIntermediateDirectories: true, attributes: nil)
      } catch {
        return nil
      }
    }

    let filename = path.appendingPathComponent(file)
    if fileManager.fileExists(atPath: filename.path) {
      do {
        try FileManager.default.removeItem(at: filename)
      } catch {
        return nil
      }
    }

    return filename
  }

  @objc static func requiresMainQueueSetup() -> Bool {
      return false
  }

  @objc(convert:resolver:rejecter:)
  func convert(_ params: [String: Any], _ resolver: @escaping RCTPromiseResolveBlock, _ rejecter: @escaping RCTPromiseRejectBlock) -> Void {

    videoURL = nil
    thumbnailURL = nil
    error = nil

    do {
      let options = try Options(with: params)
      let asset = AVAsset(url: options.url)

      if
        options.mute ?? false,
        let compositionAsset = mute(asset)
      {
        exportSession = AVAssetExportSession(asset: compositionAsset, presetName: AVAssetExportPresetHighestQuality)
      } else {
        exportSession = AVAssetExportSession(asset: asset, presetName: AVAssetExportPresetHighestQuality)
      }

      exportSession.shouldOptimizeForNetworkUse = true

      guard let outputURL = getPath(for: videoName) else {
        rejecter("", "VideoConverter: Failed to generate output video URL", nil)
        return
      }

      exportSession.outputURL = outputURL
      exportSession.outputFileType = .mp4

      if
        let start = options.trimFrom,
        let end = options.trimTo
      {
        trim(start, end)
      }

      if let scale = options.scale {
        resize(asset, with: scale)
      }

      thumbnail(for: asset, with: options)

      tasks.enter()
      exportSession.exportAsynchronously {
        switch self.exportSession.status {
          case .completed:
            self.videoURL = outputURL

          case .failed, .cancelled:
            self.error = self.exportSession.error

          default:
            break
        }
        self.tasks.leave()
      }

      tasks.notify(queue: .main) {
        if let error = self.error {
          rejecter("", "VideoConverter: \(error)", error)
          return
        }

        resolver([
          "videoUri": self.videoURL?.absoluteString,
          "thumbnailUri": self.thumbnailURL?.absoluteString
        ])
      }

    } catch let error {
      rejecter("", "VideoConverter: \(error)", error)
    }
  }

  func trim(_ start: Int, _ end: Int) {

    let startTime = CMTime(seconds: Double(start / 1000), preferredTimescale: 1000)
    let endTime = CMTime(seconds: Double(end / 1000), preferredTimescale: 1000)
    let timeRange = CMTimeRange(start: startTime, end: endTime)

    exportSession.timeRange = timeRange
  }

  func resize(_ asset: AVAsset, with scale: Options.Scale) {

    let track = asset.tracks(withMediaType: AVMediaType.video).first! as AVAssetTrack
    let size = track.naturalSize.applying(track.preferredTransform)

    let videoComposition = AVMutableVideoComposition()
    videoComposition.renderSize = CGSize(width: scale.width, height: scale.height)

    if (Float(scale.fps) < track.nominalFrameRate) {
      videoComposition.frameDuration = CMTimeMake(value: 1, timescale: Int32(scale.fps))
    } else {
      videoComposition.frameDuration = CMTimeMake(value: 100, timescale: Int32(track.nominalFrameRate * 100))
    }

    let instruction = AVMutableVideoCompositionInstruction()

    instruction.timeRange = CMTimeRange(start: CMTime.zero, duration: track.asset!.duration)

    let transformer : AVMutableVideoCompositionLayerInstruction = AVMutableVideoCompositionLayerInstruction(assetTrack: track)
    let t1 = CGAffineTransform(scaleX: scale.width / abs(size.width), y: scale.height / abs(size.height))

    transformer.setTransform(track.preferredTransform.concatenating(t1), at: CMTime.zero)
    instruction.layerInstructions = [transformer]
    videoComposition.instructions = [instruction]

    exportSession.videoComposition = videoComposition
  }

  func mute(_ asset: AVAsset) -> AVMutableComposition? {
    let track: AVAssetTrack = asset.tracks(withMediaType: AVMediaType.video).first! as AVAssetTrack
    let time = CMTimeRange(start: CMTime.zero, duration: asset.duration)
    let composition = AVMutableComposition()
    if let compositionTrack = composition.addMutableTrack(withMediaType: AVMediaType.video, preferredTrackID: CMPersistentTrackID()) {
      do {
        try compositionTrack.insertTimeRange(time, of: track, at: CMTime.zero)
        return composition
      } catch {
      }
    }

    return nil
  }

  func thumbnail(for asset: AVAsset, with options: Options) {
    tasks.enter()
    let time = CMTime(seconds: 0, preferredTimescale: 60)
    let generator = AVAssetImageGenerator(asset: asset)
    generator.appliesPreferredTrackTransform = true
    generator.requestedTimeToleranceBefore = .zero
    generator.requestedTimeToleranceAfter = .zero

    if let scale = options.scale {
      generator.maximumSize = CGSize(width: scale.width, height: scale.height)
    }

    generator.generateCGImagesAsynchronously(forTimes: [NSValue(time: time)] ) { requestedTime, image, actualTime, result, error in
      if
        let image = image,
        let uiimage = UIImage(cgImage: image).jpegData(compressionQuality: self.thumbnailQuality),
        let path = self.getPath(for: self.thumbnailName)
      {
        do {
          try uiimage.write(to: path, options: .atomicWrite)
          self.thumbnailURL = path.absoluteURL
        } catch let error {
          self.error = error
        }
      }

      self.tasks.leave()
    }
  }
}
