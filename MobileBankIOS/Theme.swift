//
//  Theme.swift
//  MobileBankIOS
//
//  Created by Rania Fadiel on 21/04/2026.
//
//


import SwiftUI

enum Theme {
    static let bg          = Color(red: 0.04, green: 0.07, blue: 0.16)   // deep navy
    static let bgElevated  = Color(red: 0.07, green: 0.11, blue: 0.22)   // card navy
    static let stroke      = Color.white.opacity(0.08)
    static let textPrimary = Color.white
    static let textMuted   = Color.white.opacity(0.65)
    static let accent      = Color(red: 0.30, green: 0.55, blue: 1.0)    // bright blue
    static let accent2     = Color(red: 0.45, green: 0.35, blue: 1.0)    // indigo
    static let success     = Color(red: 0.20, green: 0.85, blue: 0.55)
    static let danger      = Color(red: 1.00, green: 0.36, blue: 0.36)
    static let warn        = Color(red: 1.00, green: 0.75, blue: 0.25)

    static let cardGradient = LinearGradient(
        colors: [Color(red: 0.30, green: 0.55, blue: 1.0),
                 Color(red: 0.45, green: 0.35, blue: 1.0)],
        startPoint: .topLeading, endPoint: .bottomTrailing
    )
}

struct DarkCard: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding(16)
            .background(Theme.bgElevated)
            .clipShape(RoundedRectangle(cornerRadius: 20))
            .overlay(RoundedRectangle(cornerRadius: 20).stroke(Theme.stroke))
    }
}
extension View { func darkCard() -> some View { modifier(DarkCard()) } }

