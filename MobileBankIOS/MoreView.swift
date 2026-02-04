//
//  MoreView.swift
//  MobileBankIOS
//
//  Created by Rania Fadiel on 04/02/2026.
//
import SwiftUI

struct MoreView: View {
    @EnvironmentObject var store: BankStore
    @State private var showProfile = false

    var body: some View {
        ScrollView {
            VStack(spacing: 14) {
                TopBar(title: "More", onMenu: nil, trailing: AnyView(EmptyView()))
                    .padding(.horizontal)

                Button {
                    showProfile = true
                } label: {
                    HStack(spacing: 12) {
                        Circle()
                            .fill(.blue.opacity(0.9))
                            .frame(width: 46, height: 46)
                            .overlay(Text(String(store.profile.fullName.prefix(1))).foregroundStyle(.white).bold())

                        VStack(alignment: .leading, spacing: 2) {
                            Text(store.profile.fullName).font(.headline)
                            Text(store.profile.email).font(.subheadline).foregroundStyle(.secondary)
                        }
                        Spacer()
                        Image(systemName: "chevron.right").foregroundStyle(.secondary)
                    }
                    .padding()
                    .background(.ultraThinMaterial)
                    .clipShape(RoundedRectangle(cornerRadius: 18))
                    .padding(.horizontal)
                }
                .buttonStyle(.plain)
                .sheet(isPresented: $showProfile) {
                    ProfileSheet()
                        .environmentObject(store)
                }

                VStack(spacing: 10) {
                    settingsRow("Notifications", systemImage: "bell")
                    settingsRow("Security", systemImage: "lock")
                    settingsRow("Help", systemImage: "questionmark.circle")
                }
                .padding()
                .background(.gray.opacity(0.06))
                .clipShape(RoundedRectangle(cornerRadius: 18))
                .padding(.horizontal)

                Button(role: .destructive) {
                    store.logout()
                } label: {
                    Text("Logout")
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(.red.opacity(0.12))
                        .clipShape(RoundedRectangle(cornerRadius: 18))
                        .padding(.horizontal)
                }
                .buttonStyle(.plain)

                Spacer(minLength: 20)
            }
            .padding(.top, 10)
        }
    }

    private func settingsRow(_ title: String, systemImage: String) -> some View {
        HStack {
            Image(systemName: systemImage).foregroundStyle(.secondary)
            Text(title)
            Spacer()
            Image(systemName: "chevron.right").foregroundStyle(.secondary)
        }
        .padding(.vertical, 8)
    }
}
