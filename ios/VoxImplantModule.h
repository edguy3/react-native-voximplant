/*
 * Copyright (c) 2011-2019, Zingaya, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#import "RCTBridgeModule.h"
#import <VoxImplant/VoxImplant.h>

@interface VoxImplantModule : NSObject <RCTBridgeModule, VoxImplantDelegate>

- (id)init;

@end
