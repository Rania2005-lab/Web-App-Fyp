//
//  MainTabView.swift
//  MobileBankIOS
//
//  Created by Rania Fadiel on 04/02/2026.
//
import SwiftUI

struct MainTabView: View {
    var body: some View {
        TabView {
            HomeView()
                .tabItem { Label("Home", systemImage: "house") }

            TransactionsView()
                .tabItem { Label("Cards", systemImage: "creditcard") }

            TransferHubView()
                .tabItem { Label("Transfer", systemImage: "arrow.left.arrow.right") }

            AnalyticsView()
                .tabItem { Label("Analytics", systemImage: "chart.pie") }

            MoreView()
                .tabItem { Label("More", systemImage: "ellipsis") }
        }
    }
}
