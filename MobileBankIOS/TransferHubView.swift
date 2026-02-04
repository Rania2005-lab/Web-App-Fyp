//
//  TransferHubView.swift
//  MobileBankIOS
//
//  Created by Rania Fadiel on 04/02/2026.
//
import SwiftUI

struct TransferHubView: View {
    @EnvironmentObject var store: BankStore
    @State private var showSendSheet = false

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                TopBar(title: "Transfer", onMenu: nil, trailing: AnyView(EmptyView()))

                Button {
                    showSendSheet = true
                } label: {
                    HStack {
                        Image(systemName: "paperplane.fill")
                        Text("Send Money")
                            .font(.headline)
                        Spacer()
                        Image(systemName: "chevron.right")
                            .foregroundStyle(.secondary)
                    }
                    .padding()
                    .background(.ultraThinMaterial)
                    .clipShape(RoundedRectangle(cornerRadius: 22))
                }
                .buttonStyle(.plain)

                // quick info
                VStack(alignment: .leading, spacing: 8) {
                    Text("Tip").font(.headline)
                    Text("Use the Send Money sheet to pick a recent contact or use Bank Transfer.")
                        .foregroundStyle(.secondary)
                        .font(.subheadline)
                }
                .padding()
                .background(.gray.opacity(0.06))
                .clipShape(RoundedRectangle(cornerRadius: 22))

                Spacer(minLength: 12)
            }
            .padding()
        }
        .sheet(isPresented: $showSendSheet) {
            SendMoneySheet()
                .environmentObject(store)
        }
    }
}
