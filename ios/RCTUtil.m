//
//  RCTUtil.m
//  happyo
//
//  Created by Ilya Shalnev on 16.12.2021.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(Util, NSObject)

RCT_EXTERN_METHOD(setAppIconBadgeNumber:(NSInteger *)number)

@end

