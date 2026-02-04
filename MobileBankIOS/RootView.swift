//
//  RootView.swift
//  MobileBankIOS
//
//  Created by Rania Fadiel on 04/02/2026.


import SwiftUI

struct RootView: View {
    @EnvironmentObject var store: BankStore

    var body: some View {
        Group {
            if store.session.isAuthenticated {
                MainTabView()
            } else {
                LoginView()
            }
        }
    }
}
