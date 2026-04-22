////  TopBar.swift
////  MobileBankIOS
////
////  Created by Rania Fadiel on 03/02/2026.

//
//  TopBar.swift
//  MobileBankIOS
//
//  Created by Rania Fadiel on 03/02/2026.
//
import SwiftUI

struct TopBar: View {
    let title: String
    var onMenu: (() -> Void)? = nil
    var trailing: AnyView? = nil

    var body: some View {
        HStack(spacing: 12) {
            Button(action: { onMenu?() }) {
                Image(systemName: "line.3.horizontal")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundStyle(.white)
                    .frame(width: 38, height: 38)
                    .background(Theme.bgElevated)
//                    .background(Theme.card)
                    .clipShape(Circle())
                    .overlay(Circle().stroke(Theme.stroke, lineWidth: 1))
            }
            .buttonStyle(.plain)

            VStack(alignment: .leading, spacing: 2) {
                Text("Good afternoon")
                    .font(.caption)
                    .foregroundStyle(.white.opacity(0.6))
                Text(title)
                    .font(.title3)
                    .bold()
                    .foregroundStyle(.white)
            }

            Spacer()

            if let trailing { trailing }
        }
        .padding(.horizontal)
        .padding(.vertical, 10)
        .background(Theme.bg)
    }
}







//import SwiftUI
//
//struct TopBar: View {
//    let title: String
//    var onMenu: (() -> Void)? = nil
//    var trailing: AnyView? = nil
//
//    var body: some View {
//        HStack(spacing: 12) {
//            Button(action: { onMenu?() }) {
//                Image(systemName: "line.3.horizontal")
//                    .font(.title3)
//            }
//            .buttonStyle(.plain)
//
//            VStack(alignment: .leading, spacing: 2) {
//                Text("Good afternoon")
//                    .font(.caption)
//                    .foregroundStyle(.secondary)
//                Text(title)
//                    .font(.title3)
//                    .bold()
//            }
//
//            Spacer()
//
//            if let trailing { trailing }
//        }
//        .padding(.horizontal)
//        .padding(.vertical, 10)
//        .background(.ultraThinMaterial)
//    }
//}
//
