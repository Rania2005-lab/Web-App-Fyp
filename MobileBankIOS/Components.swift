
//  Components.swift
//  MobileBankIOS
//
//  Created by Rania Fadiel on 03/02/2026.


import SwiftUI

struct BalanceCard: View {
    let account: BankAccount

    var body: some View {
        ZStack(alignment: .topLeading) {
            RoundedRectangle(cornerRadius: 22)
                .fill(LinearGradient(colors: [Color(red: 0.06, green: 0.18, blue: 0.42),
                                              Color(red: 0.10, green: 0.42, blue: 0.72)],
                                     startPoint: .topLeading,
                                     endPoint: .bottomTrailing))
                .frame(height: 160)

            VStack(alignment: .leading, spacing: 10) {
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("AVAILABLE BALANCE").font(.caption2).foregroundStyle(.white.opacity(0.85))
                        Text("\(account.currency)\(account.balance, specifier: "%.2f")")
                            .font(.system(size: 40, weight: .heavy))
                            .foregroundStyle(.white)
                    }
                    Spacer()
                    Text("SecureBank")
                        .foregroundStyle(.white.opacity(0.95))
                        .bold()
                }

                Spacer()

                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("CARD HOLDER").font(.caption2).foregroundStyle(.white.opacity(0.75))
                        Text("RANIA").foregroundStyle(.white).bold()
                    }
                    Spacer()
                    VStack(alignment: .leading, spacing: 2) {
                        Text("EXPIRES").font(.caption2).foregroundStyle(.white.opacity(0.75))
                        Text("12/28").foregroundStyle(.white).bold()
                    }
                    Spacer()
                    VStack(alignment: .trailing, spacing: 6) {
                        Text(account.last4).foregroundStyle(.white).bold()
                        HStack(spacing: -8) {
                            Circle().fill(Color.red).frame(width: 18, height: 18)
                            Circle().fill(Color.orange).frame(width: 18, height: 18)
                        }
                    }
                }
            }
            .padding(16)
        }
        .shadow(radius: 18, y: 8)
    }
}

struct QuickActionsRow: View {
    let onSend: () -> Void
    let onRequest: () -> Void
    let onTopUp: () -> Void
    let onScan: () -> Void

    var body: some View {
        HStack(spacing: 12) {
            QAButton(icon: "paperplane.fill", label: "Send", action: onSend)
            QAButton(icon: "arrow.down.circle.fill", label: "Request", action: onRequest)
            QAButton(icon: "plus.circle.fill", label: "Top Up", action: onTopUp)
            QAButton(icon: "qrcode.viewfinder", label: "Scan", action: onScan)
        }
    }
}

struct QAButton: View {
    let icon: String
    let label: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                ZStack {
                    RoundedRectangle(cornerRadius: 14)
                        .fill(Color.black.opacity(0.04))
                        .frame(width: 44, height: 44)
                    Image(systemName: icon)
                        .font(.system(size: 18, weight: .semibold))
                }
                Text(label).font(.footnote).bold().foregroundStyle(.secondary)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 12)
            .background(.white)
            .clipShape(RoundedRectangle(cornerRadius: 18))
            .overlay(RoundedRectangle(cornerRadius: 18).stroke(Color.black.opacity(0.06)))
        }
        .buttonStyle(.plain)
        .shadow(color: .black.opacity(0.06), radius: 12, y: 8)
    }
}

enum StatKind { case good, bad }

struct StatCard: View {
    let title: String
    let value: String
    let hint: String
    let kind: StatKind

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack(spacing: 10) {
                Circle()
                    .fill(kind == .good ? Color.green.opacity(0.15) : Color.red.opacity(0.12))
                    .frame(width: 26, height: 26)
                Text(title).bold()
                Spacer()
            }
            Text(value).font(.title2).bold()
            Text(hint).font(.caption).foregroundStyle(.secondary)
        }
        .padding(14)
        .frame(maxWidth: .infinity)
        .background(.white)
        .clipShape(RoundedRectangle(cornerRadius: 18))
        .overlay(RoundedRectangle(cornerRadius: 18).stroke(Color.black.opacity(0.06)))
        .shadow(color: .black.opacity(0.06), radius: 12, y: 8)
    }
}

struct RecentTransactionsCard: View {
    @EnvironmentObject var store: BankStore

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Text("Recent Transactions").font(.headline)
                Spacer()
                Text("View All →").foregroundStyle(.blue).font(.subheadline).bold()
            }

            ForEach(store.transactions.prefix(3)) { tx in
                TxRow(tx: tx)
            }
        }
        .padding(14)
        .background(Color.black.opacity(0.03))
        .clipShape(RoundedRectangle(cornerRadius: 18))
        .overlay(RoundedRectangle(cornerRadius: 18).stroke(Color.black.opacity(0.06)))
    }
}

struct TxRow: View {
    let tx: Transaction

    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text(tx.merchant).bold()
                Text("\(tx.date.formatted(date: .numeric, time: .omitted)) • \(tx.type.rawValue) • \(tx.note)")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
            Spacer()
            Text(amountString())
                .bold()
                .foregroundStyle(tx.amount < 0 ? .red : .green)
        }
        .padding(12)
        .background(.white.opacity(0.75))
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color.black.opacity(0.05)))
    }

    private func amountString() -> String {
        let sign = tx.amount < 0 ? "−" : "+"
        let value = String(format: "%.2f", abs(tx.amount))
        return "\(sign)£\(value)"
    }

}
