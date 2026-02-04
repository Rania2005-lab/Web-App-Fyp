//
//  sendMoneySheet.swift
//  MobileBankIOS
//
//  Created by Rania Fadiel on 04/02/2026.
//
//
//  SendMoneySheet.swift
//  MobileBankIOS
//
//  Created by Rania Fadiel on 03/02/2026.
//
import SwiftUI

struct SendMoneySheet: View {
    @Environment(\.dismiss) private var dismiss
    @State private var search = ""

    private let recents: [(initials: String, name: String, last4: String)] = [
        ("SJ", "Sarah Johnson", "5678"),
        ("JM", "John Murphy", "7952"),
        ("EO", "Emma O'Brien", "5678"),
        ("MK", "Michael Kelly", "5432")
    ]

    var filtered: [(String,String,String)] {
        if search.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty { return recents }
        let q = search.lowercased()
        return recents.filter { $0.name.lowercased().contains(q) || $0.last4.contains(q) }
    }

    var body: some View {
        NavigationStack {
            VStack(spacing: 14) {
                // search bar
                HStack(spacing: 10) {
                    Image(systemName: "magnifyingglass").foregroundStyle(.secondary)
                    TextField("Search by name or IBAN", text: $search)
                        .textInputAutocapitalization(.words)
                }
                .padding(12)
                .background(Color.black.opacity(0.04))
                .clipShape(RoundedRectangle(cornerRadius: 14))

                HStack(spacing: 12) {
                    ActionPill(icon: "person.crop.circle", title: "New Contact")
                    ActionPill(icon: "building.columns", title: "Bank Transfer")
                }

                Text("Recent")
                    .foregroundStyle(.secondary)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.top, 6)

                VStack(spacing: 10) {
                    ForEach(filtered.indices, id: \.self) { i in
                        let item = filtered[i]
                        NavigationLink {
                            TransferFormView(prefilledRecipient: item.1)
                        } label: {
                            HStack(spacing: 12) {
                                Circle()
                                    .fill(Color(red: 0.05, green: 0.20, blue: 0.45))
                                    .frame(width: 42, height: 42)
                                    .overlay(Text(item.0).foregroundStyle(.white).bold())

                                VStack(alignment: .leading, spacing: 4) {
                                    Text(item.1).bold().foregroundStyle(.primary)
                                    Text("•••• \(item.2)").foregroundStyle(.secondary).font(.caption)
                                }
                                Spacer()
                                Image(systemName: "chevron.right")
                                    .foregroundStyle(.secondary)
                            }
                            .padding(12)
                            .background(.white)
                            .clipShape(RoundedRectangle(cornerRadius: 16))
                            .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color.black.opacity(0.06)))
                        }
                        .buttonStyle(.plain)
                    }
                }

                Spacer()
            }
            .padding(16)
            .navigationTitle("Send Money")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Close") { dismiss() }
                }
            }
        }
        .presentationDetents([.medium, .large])
    }
}

struct ActionPill: View {
    let icon: String
    let title: String

    var body: some View {
        HStack(spacing: 10) {
            Circle()
                .fill(Color.green.opacity(0.15))
                .frame(width: 38, height: 38)
                .overlay(Image(systemName: icon).foregroundStyle(Color.green))

            Text(title).bold()
            Spacer()
        }
        .padding(12)
        .background(.white)
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color.black.opacity(0.06)))
    }
}
