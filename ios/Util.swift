//
//  Util.swift
//  happyo
//
//  Created by Ilya Shalnev on 16.12.2021.
//

import Foundation
import UIKit

@objc(Util)

class Util: NSObject {

  @objc(setAppIconBadgeNumber:)
  func setAppIconBadgeNumber(_ number: Int) -> Void {
    DispatchQueue.main.async {
      UIApplication.shared.applicationIconBadgeNumber = number
    }
  }
}
