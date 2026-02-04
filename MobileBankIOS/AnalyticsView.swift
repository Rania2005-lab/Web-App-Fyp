//
//  AnalyticsView.swift
//  MobileBankIOS
//
//  Created by Rania Fadiel on 04/02/2026.
//
import SwiftUI
import Charts

struct AnalyticsView: View {
    @EnvironmentObject var store: BankStore

    struct SpendSlice: Identifiable {
        let id = UUID()
        let name: String
        let value: Double
    }

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                TopBar(title: "Analytics", onMenu: nil, trailing: AnyView(EmptyView()))

                spendingCard
                savingsGoalCard
            }
            .padding()
        }
    }

    private var spendingCard: some View {
        let slices = makeSpendingSlices()
        let total = slices.reduce(0) { $0 + $1.value }

        return VStack(alignment: .leading, spacing: 12) {
            HStack {
                VStack(alignment: .leading) {
                    Text("Spending Overview").font(.headline)
                    Text("This month").font(.subheadline).foregroundStyle(.secondary)
                }
                Spacer()
                VStack(alignment: .trailing) {
                    Text("£\(total, specifier: "%.0f")").font(.title2).bold()
                    Text("Total spent").font(.caption).foregroundStyle(.secondary)
                }
            }

            Chart(slices) { s in
                SectorMark(
                    angle: .value("Spend", s.value),
                    innerRadius: .ratio(0.6)
                )
                .cornerRadius(6)
            }
            .frame(height: 220)

            // simple legend
            VStack(spacing: 8) {
                ForEach(slices) { s in
                    HStack {
                        Text(s.name)
                        Spacer()
                        Text("£\(s.value, specifier: "%.0f")").foregroundStyle(.secondary)
                    }
                    .font(.subheadline)
                }
            }
        }
        .padding()
        .background(.ultraThinMaterial)
        .clipShape(RoundedRectangle(cornerRadius: 22))
    }

    private var savingsGoalCard: some View {
        let goal = 5000.0
        let saved = 2450.0
        let progress = min(1.0, saved / goal)

        return VStack(alignment: .leading, spacing: 12) {
            Text("Savings Goal").font(.headline)

            HStack(spacing: 12) {
                RoundedRectangle(cornerRadius: 16)
                    .fill(.teal)
                    .frame(width: 58, height: 58)
                    .overlay(Text("🏖️").font(.title2))

                VStack(alignment: .leading, spacing: 4) {
                    Text("Summer Vacation").font(.headline)
                    Text("£\(saved, specifier: "%.0f") of £\(goal, specifier: "%.0f")")
                        .foregroundStyle(.secondary)
                        .font(.subheadline)
                }
            }

            ProgressView(value: progress)
            Text("\(Int(progress * 100))% achieved • £\(goal - saved, specifier: "%.0f") to go")
                .font(.caption)
                .foregroundStyle(.secondary)
        }
        .padding()
        .background(.ultraThinMaterial)
        .clipShape(RoundedRectangle(cornerRadius: 22))
    }

    private func makeSpendingSlices() -> [SpendSlice] {
        // Simple grouping (mock). You can replace with real logic later.
        let spent = store.transactions.filter { $0.amount < 0 }.map { abs($0.amount) }
        let total = spent.reduce(0, +)
        if total == 0 { return [
            SpendSlice(name: "Shopping", value: 450),
            SpendSlice(name: "Food & Dining", value: 320),
            SpendSlice(name: "Transport", value: 180),
            SpendSlice(name: "Bills", value: 280),
            SpendSlice(name: "Entertainment", value: 150),
            SpendSlice(name: "Other", value: 120)
        ]}

        return [
            SpendSlice(name: "Shopping", value: total * 0.30),
            SpendSlice(name: "Food & Dining", value: total * 0.21),
            SpendSlice(name: "Transport", value: total * 0.12),
            SpendSlice(name: "Bills", value: total * 0.19),
            SpendSlice(name: "Entertainment", value: total * 0.10),
            SpendSlice(name: "Other", value: total * 0.08)
        ]
    }
}
