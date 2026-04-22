//
//  SafetyView.swift
//  MobileBankIOS
//
//  Created by Rania Fadiel on 21/04/2026.
//

//
//  SafetyView.swift
//  MobileBankIOS
//

import SwiftUI

struct SafetyView: View {
    @EnvironmentObject var store: BankStore
    @State private var showTrusted = false

    var body: some View {
        ZStack {
            Theme.bg.ignoresSafeArea()
            ScrollView {
                VStack(spacing: 16) {
                    TopBar(title: "Safety", onMenu: nil, trailing: AnyView(EmptyView()))

                    securityScoreCard
                    sosCard
                    cardsSection
                    alertsSection
                    loginHistorySection
                }
                .padding()
            }
        }
        .sheet(isPresented: $showTrusted) {
            TrustedContactsSheet().environmentObject(store)
        }
    }

    private var securityScoreCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("SECURITY SCORE").font(.caption).foregroundStyle(Theme.textMuted)
                    Text("\(store.securityScore)/100").font(.system(size: 36, weight: .heavy)).foregroundStyle(.white)
                }
                Spacer()
                Image(systemName: "shield.lefthalf.filled")
                    .font(.system(size: 44)).foregroundStyle(Theme.accent)
            }
            ProgressView(value: Double(store.securityScore), total: 100)
                .tint(Theme.accent)
            Text("Your account is well protected.")
                .font(.caption).foregroundStyle(Theme.textMuted)
        }
        .padding(18)
        .background(Theme.cardGradient.opacity(0.25))
        .background(Theme.bgElevated)
        .clipShape(RoundedRectangle(cornerRadius: 22))
        .overlay(RoundedRectangle(cornerRadius: 22).stroke(Theme.stroke))
    }

    private var sosCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: "phone.badge.waveform.fill").foregroundStyle(Theme.danger)
                Text("Emergency Contact").font(.headline).foregroundStyle(.white)
                Spacer()
                Button("Manage") { showTrusted = true }
                    .font(.footnote).foregroundStyle(Theme.accent)
            }

            if let primary = store.trustedContacts.first {
                Button {
                    callNumber(primary.phone)
                } label: {
                    HStack(spacing: 12) {
                        Circle().fill(Theme.danger.opacity(0.2))
                            .frame(width: 46, height: 46)
                            .overlay(Text(primary.initials).foregroundStyle(Theme.danger).bold())
                        VStack(alignment: .leading, spacing: 2) {
                            Text("Call \(primary.name)").foregroundStyle(.white).bold()
                            Text(primary.relation).font(.caption).foregroundStyle(Theme.textMuted)
                        }
                        Spacer()
                        Image(systemName: "phone.fill").foregroundStyle(.white)
                            .padding(10)
                            .background(Theme.danger)
                            .clipShape(Circle())
                    }
                    .padding(12)
                    .background(Theme.bg)
                    .clipShape(RoundedRectangle(cornerRadius: 16))
                }
                .buttonStyle(.plain)
            }
        }
        .darkCard()
    }

    private var cardsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Card Controls").font(.headline).foregroundStyle(.white)
            ForEach(store.cards) { card in
                NavigationLink {
                    CardControlView(cardId: card.id).environmentObject(store)
                } label: {
                    HStack {
                        Image(systemName: card.isFrozen ? "snowflake" : "creditcard.fill")
                            .foregroundStyle(card.isFrozen ? Theme.accent : .white)
                            .frame(width: 38, height: 38)
                            .background(Theme.bg).clipShape(RoundedRectangle(cornerRadius: 10))
                        VStack(alignment: .leading, spacing: 2) {
                            Text(card.name).foregroundStyle(.white).bold()
                            Text("•••• \(card.last4) · £\(Int(card.dailyLimit))/day")
                                .font(.caption).foregroundStyle(Theme.textMuted)
                        }
                        Spacer()
                        if card.isFrozen {
                            Text("FROZEN").font(.caption2).bold().foregroundStyle(Theme.accent)
                                .padding(.horizontal, 8).padding(.vertical, 4)
                                .background(Theme.accent.opacity(0.15)).clipShape(Capsule())
                        }
                        Image(systemName: "chevron.right").foregroundStyle(Theme.textMuted)
                    }
                    .padding(12)
                    .background(Theme.bg)
                    .clipShape(RoundedRectangle(cornerRadius: 14))
                }
                .buttonStyle(.plain)
            }
        }
        .darkCard()
    }

    private var alertsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Fraud Alerts").font(.headline).foregroundStyle(.white)
            ForEach(store.fraudAlerts) { alert in
                HStack(alignment: .top, spacing: 10) {
                    Image(systemName: alert.resolved ? "checkmark.shield.fill" : "exclamationmark.triangle.fill")
                        .foregroundStyle(alert.resolved ? Theme.success : Theme.warn)
                    VStack(alignment: .leading, spacing: 2) {
                        Text(alert.title).foregroundStyle(.white).bold()
                        Text(alert.detail).font(.caption).foregroundStyle(Theme.textMuted)
                    }
                    Spacer()
                    if !alert.resolved {
                        Button("Resolve") { store.resolveAlert(id: alert.id) }
                            .font(.caption).foregroundStyle(Theme.accent)
                    }
                }
                .padding(12)
                .background(Theme.bg)
                .clipShape(RoundedRectangle(cornerRadius: 14))
            }
        }
        .darkCard()
    }

    private var loginHistorySection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Recent Logins").font(.headline).foregroundStyle(.white)
            ForEach(store.loginHistory) { ev in
                HStack {
                    Image(systemName: ev.suspicious ? "xmark.octagon.fill" : "checkmark.circle.fill")
                        .foregroundStyle(ev.suspicious ? Theme.danger : Theme.success)
                    VStack(alignment: .leading, spacing: 2) {
                        Text(ev.device).foregroundStyle(.white).bold()
                        Text("\(ev.location) · \(ev.date.formatted(date: .abbreviated, time: .shortened))")
                            .font(.caption).foregroundStyle(Theme.textMuted)
                    }
                    Spacer()
                }
                .padding(12)
                .background(Theme.bg)
                .clipShape(RoundedRectangle(cornerRadius: 14))
            }
        }
        .darkCard()
    }

    private func callNumber(_ phone: String) {
        let digits = phone.filter { "+0123456789".contains($0) }
        if let url = URL(string: "tel://\(digits)"), UIApplication.shared.canOpenURL(url) {
            UIApplication.shared.open(url)
        }
    }
}
