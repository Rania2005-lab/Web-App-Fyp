//
//  MobileBankIOSApp.swift
//  MobileBankIOS
//
//  Created by Rania Fadiel on 04/02/2026.
import SwiftUI

@main
struct MobileBankIOSApp: App {
    @StateObject private var store = BankStore()

    init() {
        let appearance = UITabBarAppearance()
        appearance.configureWithOpaqueBackground()
        appearance.backgroundColor = UIColor(red: 0.07, green: 0.11, blue: 0.22, alpha: 1)
        UITabBar.appearance().standardAppearance = appearance
        UITabBar.appearance().scrollEdgeAppearance = appearance
        UITabBar.appearance().unselectedItemTintColor = UIColor.white.withAlphaComponent(0.55)
    }

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(store)
                .preferredColorScheme(.dark)
                .tint(Theme.accent)
        }
    }
}

//import SwiftUI
//
//@main
//struct MobileBankIOSApp: App {
//    @StateObject private var store = BankStore()
//    
//    var body: some Scene {
//        WindowGroup {
//            RootView()
//                .environmentObject(store)
//        }
//    }
//    
//}
