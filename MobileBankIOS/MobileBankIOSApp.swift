//
//  MobileBankIOSApp.swift
//  MobileBankIOS
//
//  Created by Rania Fadiel on 04/02/2026.
//

import SwiftUI

@main
struct MobileBankIOSApp: App {
    @StateObject private var store = BankStore()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(store)
        }
    }
}
