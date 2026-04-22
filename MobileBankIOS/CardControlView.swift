//
//  CardControlView.swift
//  MobileBankIOS
//
//  Created by Rania Fadiel on 21/04/2026.
//

//
//  CardControlView.swift
//  MobileBankIOS
//

import SwiftUI

struct CardControlView: View {
    @EnvironmentObject var store: BankStore
    let cardId: String

    var body: some View {
        ZStack {
            Theme.bg.ignoresSafeArea()
            ScrollView {
                if let idx = store.cards.firstIndex(where: { $0.id == cardId }) {
                    let card = store.cards[idx]
                    VStack(spacing: 16) {
                        // mini card
                        ZStack(alignment: .bottomLeading) {
                            RoundedRectangle(cornerRadius: 22)
                                .fill(Theme.cardGradient).frame(height: 170)
                                .overlay(card.isFrozen ?
                                    Color.black.opacity(0.55).clipShape(RoundedRectangle(cornerRadius: 22)) : nil)
                            VStack(alignment: .leading, spacing: 8) {
                                Text(card.name.uppercased()).font(.caption).foregroundStyle(.white.opacity(0.8))
                                Spacer()
                                Text("•••• •••• •••• \(card.last4)")
                                    .font(.title3).bold().foregroundStyle(.white)
                            }.padding(18).frame(maxWidth: .infinity, alignment: .leading)
                            if card.isFrozen {
                                Image(systemName: "snowflake")
                                    .font(.system(size: 60)).foregroundStyle(.white)
                                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                            }
                        }

                        VStack(spacing: 12) {
                            Toggle(isOn: Binding(
                                get: { card.isFrozen },
                                set: { _ in store.toggleFreeze(cardId: card.id) })
                            ) {
                                Label("Freeze card", systemImage: "snowflake")
                                    .foregroundStyle(.white)
                            }
                            Divider().background(Theme.stroke)

                            Toggle("Contactless", isOn: Binding(
                                get: { card.contactlessEnabled },
                                set: { v in store.cards[idx].contactlessEnabled = v }))
                            .foregroundStyle(.white)

                            Toggle("Online payments", isOn: Binding(
                                get: { card.onlineEnabled },
                                set: { v in store.cards[idx].onlineEnabled = v }))
                            .foregroundStyle(.white)

                            Toggle("ATM withdrawals", isOn: Binding(
                                get: { card.atmEnabled },
                                set: { v in store.cards[idx].atmEnabled = v }))
                            .foregroundStyle(.white)
                        }
                        .tint(Theme.accent)
                        .darkCard()

                        VStack(alignment: .leading, spacing: 10) {
                            HStack {
                                Text("Daily spend limit").foregroundStyle(.white).bold()
                                Spacer()
                                Text("£\(Int(card.dailyLimit))").foregroundStyle(Theme.accent).bold()
                            }
                            Slider(
                                value: Binding(
                                    get: { store.cards[idx].dailyLimit },
                                    set: { store.setDailyLimit(cardId: card.id, limit: $0) }
                                ),
                                in: 50...2000,
                                step: 50
                            )
                            .tint(Theme.accent)
                            Text("Set the maximum you can spend in a day with this card.")
                                .font(.caption).foregroundStyle(Theme.textMuted)
                        }
                        .darkCard()
                    }
                    .padding()
                }
            }
        }
        .navigationTitle("Card Controls")
        .navigationBarTitleDisplayMode(.inline)
    }
}
