//
//  HomeView.swift
//  MobileBankIOS
//
//  Created by Rania Fadiel on 04/02/2026.
import SwiftUI

struct HomeView: View {
    @EnvironmentObject var store: BankStore
    @State private var showSendMoney = false

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {

                // TopBar (your file TopBar.swift)
                TopBar(title: store.profile.fullName, onMenu: nil, trailing: AnyView(topRightButtons))

                balanceCard

                quickActions

                metricsRow

                recentTransactions
            }
            .padding()
        }
        .sheet(isPresented: $showSendMoney) {
            SendMoneySheet()
                .environmentObject(store)
        }
    }

    private var topRightButtons: some View {
        HStack(spacing: 10) {
            Button { } label: { Image(systemName: "magnifyingglass") }
            Button { } label: { Image(systemName: "bell") }
            Button { } label: { Image(systemName: "gearshape") }
            Circle()
                .fill(.blue.opacity(0.9))
                .frame(width: 34, height: 34)
                .overlay(Text(String(store.profile.fullName.prefix(1))).foregroundStyle(.white).bold())
        }
        .buttonStyle(.plain)
        .foregroundStyle(.primary)
    }

    private var balanceCard: some View {
        let total = store.accounts.reduce(0) { $0 + $1.balance }
        return ZStack(alignment: .topLeading) {
            RoundedRectangle(cornerRadius: 22)
                .fill(LinearGradient(colors: [.blue.opacity(0.9), .indigo.opacity(0.95)],
                                     startPoint: .topLeading, endPoint: .bottomTrailing))
                .frame(height: 170)

            VStack(alignment: .leading, spacing: 10) {
                Text("AVAILABLE BALANCE")
                    .font(.caption)
                    .foregroundStyle(.white.opacity(0.8))

                Text("£\(total, specifier: "%.2f")")
                    .font(.system(size: 38, weight: .bold))
                    .foregroundStyle(.white)

                Spacer()

                HStack {
                    VStack(alignment: .leading) {
                        Text("CARD HOLDER").font(.caption2).foregroundStyle(.white.opacity(0.8))
                        Text(store.profile.fullName.uppercased()).font(.headline).foregroundStyle(.white)
                    }
                    Spacer()
                    VStack(alignment: .leading) {
                        Text("EXPIRES").font(.caption2).foregroundStyle(.white.opacity(0.8))
                        Text("12/28").font(.headline).foregroundStyle(.white)
                    }
                }
            }
            .padding(18)
        }
    }

    private var quickActions: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Quick Actions").font(.headline)

            HStack(spacing: 12) {
                actionTile(icon: "paperplane.fill", title: "Send") { showSendMoney = true }
                actionTile(icon: "arrow.down.circle.fill", title: "Request") { }
                actionTile(icon: "plus.circle.fill", title: "Top Up") { }
                actionTile(icon: "qrcode.viewfinder", title: "Scan") { }
            }
        }
    }

    private func actionTile(icon: String, title: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            VStack(spacing: 8) {
                Image(systemName: icon).font(.title3)
                    .frame(width: 44, height: 44)
                    .background(.gray.opacity(0.12))
                    .clipShape(RoundedRectangle(cornerRadius: 14))
                Text(title).font(.caption).foregroundStyle(.secondary)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 12)
            .background(.ultraThinMaterial)
            .clipShape(RoundedRectangle(cornerRadius: 18))
        }
        .buttonStyle(.plain)
    }
    private func money(_ amount: Double) -> String {
        "£" + String(format: "%.2f", amount)
    }

    private var metricsRow: some View {
        let income = store.transactions.filter { $0.amount > 0 }.reduce(0) { $0 + $1.amount }
        let spending = store.transactions.filter { $0.amount < 0 }.reduce(0) { $0 + abs($1.amount) }

        return HStack(spacing: 12) {
            metricCard(title: "Income", value: money(income), icon: "arrow.up.right")
            metricCard(title: "Spending", value: money(spending), icon: "arrow.down.left")

        }
    }

    private func metricCard(title: String, value: String, icon: String) -> some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text(title).font(.headline)
                Text(value).font(.title2).bold()
            }
            Spacer()
            Image(systemName: icon)
                .font(.title3)
                .foregroundStyle(.secondary)
        }
        .padding()
        .frame(maxWidth: .infinity)
        .background(.ultraThinMaterial)
        .clipShape(RoundedRectangle(cornerRadius: 18))
    }

    private var recentTransactions: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Text("Recent Transactions").font(.headline)
                Spacer()
                Text("View All →").font(.subheadline).foregroundStyle(.blue)
            }

            ForEach(store.transactions.prefix(5)) { tx in
                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        Text(tx.merchant).font(.headline)
                        Text("\(tx.date.formatted(date: .numeric, time: .omitted)) • \(tx.type.rawValue)")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                    Spacer()
                    Text(amountText(tx.amount))
                        .font(.headline)
                        .foregroundStyle(tx.amount < 0 ? .red : .green)
                }
                .padding()
                .background(.gray.opacity(0.06))
                .clipShape(RoundedRectangle(cornerRadius: 16))
            }
        }
    }

    private func amountText(_ amt: Double) -> String {
        let sign = amt < 0 ? "-" : "+"
        let value = String(format: "%.2f", abs(amt))
        return "\(sign)£\(value)"
    }

}

