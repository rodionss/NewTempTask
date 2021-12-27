//
//  RTCVideoConverter.m
//  happyo
//
//  Created by Ilya Shalnev on 03.12.2021.
//


#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(VideoConverter, NSObject)

RCT_EXTERN_METHOD(convert:(NSDictionary *)params resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
