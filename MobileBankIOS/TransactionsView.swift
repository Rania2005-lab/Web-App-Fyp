//
//  TransactionsView.swift
//  MobileBankIOS
//
//  Created by Rania Fadiel on 04/02/2026.
//

//
//  TransactionsView.swift
//  MobileBankIOS
//
//  Created by Rania Fadiel on 04/02/2026.
//
import SwiftUI

struct TransactionsView: View {
    @EnvironmentObject var store: BankStore

    var body: some View {
        ZStack {
            Theme.bg.ignoresSafeArea()

            ScrollView {
                VStack(spacing: 14) {
                    TopBar(title: "Cards", onMenu: nil, trailing: AnyView(EmptyView()))
                        .padding(.horizontal)

                    ForEach(store.accounts) { acc in
                        VStack(alignment: .leading, spacing: 10) {
                            HStack {
                                Text(acc.name).font(.headline).foregroundStyle(.white)
                                Spacer()
                                Text("\(acc.currency)\(acc.balance, specifier: "%.2f")")
                                    .font(.headline).foregroundStyle(.white)
                            }
                            Text("•••• \(acc.last4)")
                                .foregroundStyle(.white.opacity(0.6))
                                .font(.subheadline)
                        }
                        .padding()
                        .background(Theme.bgElevated)
                        .clipShape(RoundedRectangle(cornerRadius: 18))
                        .overlay(RoundedRectangle(cornerRadius: 18).stroke(Theme.stroke, lineWidth: 1))
                        .padding(.horizontal)
                    }

                    Divider().background(Theme.stroke).padding(.horizontal)

                    VStack(alignment: .leading, spacing: 10) {
                        Text("Recent Transactions").font(.headline).foregroundStyle(.white)

                        ForEach(store.transactions.prefix(10)) { tx in
                            HStack {
                                VStack(alignment: .leading, spacing: 2) {
                                    Text(tx.merchant).font(.headline).foregroundStyle(.white)
                                    Text("\(tx.date.formatted(date: .abbreviated, time: .omitted)) • \(tx.category)")
                                        .font(.caption)
                                        .foregroundStyle(.white.opacity(0.6))
                                }
                                Spacer()
                                Text(formatAmount(tx.amount))
                                    .font(.headline)
                                    .foregroundStyle(tx.amount < 0 ? .red : .green)
                            }
                            .padding()
                            .background(Theme.bgElevated)
                            .clipShape(RoundedRectangle(cornerRadius: 16))
                            .overlay(RoundedRectangle(cornerRadius: 16).stroke(Theme.stroke, lineWidth: 1))
                        }
                    }
                    .padding(.horizontal)

                    Spacer(minLength: 20)
                }
                .padding(.top, 10)
            }
        }
        .foregroundStyle(.white)
    }

    private func formatAmount(_ amt: Double) -> String {
        let sign = amt < 0 ? "-" : "+"
        let value = String(format: "%.2f", abs(amt))
        return "\(sign)£\(value)"
    }
}


//import SwiftUI
//
//struct TransactionsView: View {
//    @EnvironmentObject var store: BankStore
//
//    var body: some View {
//        ScrollView {
//            VStack(spacing: 14) {
//                TopBar(title: "Cards", onMenu: nil, trailing: AnyView(EmptyView()))
//                    .padding(.horizontal)
//
//                ForEach(store.accounts) { acc in
//                    VStack(alignment: .leading, spacing: 10) {
//                        HStack {
//                            Text(acc.name).font(.headline)
//                            Spacer()
//                            Text("\(acc.currency)\(acc.balance, specifier: "%.2f")")
//                                .font(.headline)
//                        }
//                        Text("•••• \(acc.last4)")
//                            .foregroundStyle(.secondary)
//                            .font(.subheadline)
//                    }
//                    .padding()
//                    .background(.ultraThinMaterial)
//                    .clipShape(RoundedRectangle(cornerRadius: 18))
//                    .padding(.horizontal)
//                }
//
//                Divider().padding(.horizontal)
//
//                VStack(alignment: .leading, spacing: 10) {
//                    Text("Recent Transactions").font(.headline)
//
//                    ForEach(store.transactions.prefix(10)) { tx in
//                        HStack {
//                            VStack(alignment: .leading, spacing: 2) {
//                                Text(tx.merchant).font(.headline)
//                                Text("\(tx.date.formatted(date: .abbreviated, time: .omitted)) • \(tx.category)")
//                                    .font(.caption)
//                                    .foregroundStyle(.secondary)
//                            }
//                            Spacer()
//                            Text(formatAmount(tx.amount))
//                                .font(.headline)
//                                .foregroundStyle(tx.amount < 0 ? .red : .green)
//                        }
//                        .padding()
//                        .background(.gray.opacity(0.06))
//                        .clipShape(RoundedRectangle(cornerRadius: 16))
//                    }
//                }
//                .padding(.horizontal)
//
//                Spacer(minLength: 20)
//            }
//            .padding(.top, 10)
//        }
//    }
//
//    private func formatAmount(_ amt: Double) -> String {
//        let sign = amt < 0 ? "-" : "+"
//        let value = String(format: "%.2f", abs(amt))
//        return "\(sign)£\(value)"
//    }
//
//}
