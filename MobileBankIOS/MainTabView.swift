////
////  MainTabView.swift
////  MobileBankIOS
////
////  Created by Rania Fadiel on 04/02/2026.

//
//  MainTabView.swift
//  MobileBankIOS
//
//  Created by Rania Fadiel on 04/02/2026.
//
import SwiftUI

struct MainTabView: View {
    init() {
        let appearance = UITabBarAppearance()
        appearance.configureWithOpaqueBackground()
        appearance.backgroundColor = UIColor(Theme.bgElevated)
        UITabBar.appearance().standardAppearance = appearance
        UITabBar.appearance().scrollEdgeAppearance = appearance
        UITabBar.appearance().tintColor = UIColor(Theme.accent)
    }

    var body: some View {
        TabView {
            HomeView()
                .tabItem { Label("Home", systemImage: "house") }

            TransactionsView()
                .tabItem { Label("Cards", systemImage: "creditcard") }

            SafetyView()
                .tabItem { Label("Safety", systemImage: "shield.lefthalf.filled") }

            TransferHubView()
                .tabItem { Label("Transfer", systemImage: "arrow.left.arrow.right") }

            AnalyticsView()
                .tabItem { Label("Analytics", systemImage: "chart.pie") }

            MoreView()
                .tabItem { Label("More", systemImage: "ellipsis") }
        }
        .tint(Theme.accent)
    }
}










//import SwiftUI
//
//struct MainTabView: View {
//    var body: some View {
//        TabView {
//            HomeView()
//                .tabItem { Label("Home", systemImage: "house") }
//
//            TransactionsView()
//                .tabItem { Label("Cards", systemImage: "creditcard") }
//
//            TransferHubView()
//                .tabItem { Label("Transfer", systemImage: "arrow.left.arrow.right") }
//
//            AnalyticsView()
//                .tabItem { Label("Analytics", systemImage: "chart.pie") }
//
//            MoreView()
//                .tabItem { Label("More", systemImage: "ellipsis") }
//        }
//    }
//}
