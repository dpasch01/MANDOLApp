
#import <Cordova/CDV.h>
#import <UserNotifications/UserNotifications.h>

@interface URLCopyNotification : CDVPlugin {
    NSTimer *timer;
    NSString *recentURL;
    UIPasteboard *pasteboard;
    CDVInvokedUrlCommand* receivedNotification;
}

- (void)monitorBoard:(NSTimer*)timer;
- (void)startMonitoring;
- (void)stopMonitoring;
- (void)startURLCopyMonitoring:(CDVInvokedUrlCommand*)command;
- (void)cancelURLCopyMonitoring:(CDVInvokedUrlCommand*)command;
- (void)onNotificationReceived:(CDVInvokedUrlCommand*)command;

@property(nonatomic, retain) NSTimer *timer;

@end

@implementation URLCopyNotification

- (void)startURLCopyMonitoring:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult = nil;
    pasteboard = [UIPasteboard generalPasteboard];

    [pasteboard setValue:@"" forPasteboardType:UIPasteboardNameGeneral];
    [[UIApplication sharedApplication] setApplicationIconBadgeNumber: 0];
    [[UIApplication sharedApplication] cancelAllLocalNotifications];

    UNUserNotificationCenter *notificationCenter = [UNUserNotificationCenter currentNotificationCenter];
    [notificationCenter requestAuthorizationWithOptions: (UNAuthorizationOptionBadge | UNAuthorizationOptionSound | UNAuthorizationOptionAlert) completionHandler:^(BOOL granted, NSError * _Nullable error){
        if(error){
            NSLog(@"URLCopy notifications permission denied.");
        }else{
            NSLog(@"URLCopy notifications permission granted.");
        }
    }];

    [[UIApplication sharedApplication] beginBackgroundTaskWithExpirationHandler:^{
        [self stopMonitoring];
    }];

    [self startMonitoring];

    NSString* echo = [command.arguments objectAtIndex:0];
    if (echo != nil && [echo length] > 0) {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:echo];
    } else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
    }

    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)onNotificationReceived:(CDVInvokedUrlCommand*)command{
    receivedNotification = command;
}

- (void)cancelURLCopyMonitoring:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult = nil;
    pasteboard = [UIPasteboard generalPasteboard];

    [pasteboard setValue:@"" forPasteboardType:UIPasteboardNameGeneral];
    [[UIApplication sharedApplication] setApplicationIconBadgeNumber: 0];
    [[UIApplication sharedApplication] cancelAllLocalNotifications];

    [[UIApplication sharedApplication] beginBackgroundTaskWithExpirationHandler:^{
        [self stopMonitoring];
    }];

    NSString* echo = [command.arguments objectAtIndex:0];
    if (echo != nil && [echo length] > 0) {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:echo];
    } else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
    }

    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}


- (void) stopMonitoring{
    NSLog(@"Background monitoring has been stopped.");
}

- (void) startMonitoring{
    [pasteboard setValue:@"" forPasteboardType:UIPasteboardNameGeneral];
    [[UIApplication sharedApplication] setApplicationIconBadgeNumber: 0];
    [[UIApplication sharedApplication] cancelAllLocalNotifications];

    timer = [NSTimer scheduledTimerWithTimeInterval:1 target:self selector:@selector(monitorBoard:) userInfo:nil repeats:YES];
    NSLog(@"Background monitoring has began.");
}


- (void)monitorBoard:(NSTimer *)timer{
    if([[UIApplication sharedApplication] applicationState] == UIApplicationStateBackground){
        NSTimeInterval timeLeft = [UIApplication sharedApplication].backgroundTimeRemaining;
        NSLog(@"Background time remaining: %.0f seconds.", timeLeft);
    }

    NSLog(@"RECENT-URL: %@", recentURL);

    if([pasteboard containsPasteboardTypes:[NSArray arrayWithObjects:@"public.utf8-plain-text", @"public.text", nil]]){
        if(recentURL.length == 0 || ![recentURL isEqualToString:pasteboard.string]){
            recentURL = pasteboard.string;
            NSLog(@"String representation present: %@", pasteboard.string);

            UNMutableNotificationContent *content = [[UNMutableNotificationContent alloc] init];
            content.title = [NSString localizedUserNotificationStringForKey:@"Do you want to report this URL?"
                                                                  arguments:nil];
            content.body = [NSString localizedUserNotificationStringForKey:recentURL
                                                                 arguments:nil];
            content.sound = [UNNotificationSound defaultSound];

            content.badge = [NSNumber numberWithInteger:([UIApplication sharedApplication].applicationIconBadgeNumber + 1)];

            UNTimeIntervalNotificationTrigger *trigger = [UNTimeIntervalNotificationTrigger
                                                          triggerWithTimeInterval:1.f
                                                          repeats:NO];

            UNNotificationRequest *request = [UNNotificationRequest requestWithIdentifier:@"OneSecond"
                                                                                  content:content
                                                                                  trigger:trigger];

            UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];

            NSLog(@"Emitting Notification...");
            [center addNotificationRequest:request withCompletionHandler:^(NSError * _Nullable error) {
                if (!error) {
                    NSLog(@"Report NotificationRequest succeeded!");

                    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:recentURL];
                    [self.commandDelegate sendPluginResult:pluginResult callbackId:receivedNotification.callbackId];
                    recentURL = nil;
                }
            }];

        }
    }
}

@synthesize timer;

@end
