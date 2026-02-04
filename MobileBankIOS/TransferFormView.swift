//
//  TransferFormView.swift
//  MobileBankIOS
//
//  Created by Rania Fadiel on 04/02/2026.
//
//
//  TransferFormView.swift
//  MobileBankIOS
//
//  Created by Rania Fadiel on 03/02/2026.
//

import SwiftUI

struct TransferFormView: View {
    @EnvironmentObject var store: BankStore
    @Environment(\.dismiss) private var dismiss

    let prefilledRecipient: String?

    @State private var fromAccountId: String = ""
    @State private var recipientName: String = ""
    @State private var sortCode: String = ""
    @State private var accountNumber: String = ""
    @State private var reference: String = ""
    @State private var amountText: String = ""

    @State private var error: String?
    @State private var showConfirmation = false
    @State private var confirmedName = ""
    @State private var confirmedAmount = 0.0

    var body: some View {
        ScrollView {
            VStack(spacing: 14) {
                Text("Transfer money")
                    .font(.largeTitle).bold()
                    .frame(maxWidth: .infinity, alignment: .leading)

                // Amount
                HStack(spacing: 12) {
                    Text("£")
                        .font(.system(size: 44, weight: .bold))
                        .foregroundStyle(.secondary)

                    TextField("0.00", text: $amountText)
                        .keyboardType(.decimalPad)
                        .font(.system(size: 44, weight: .heavy))
                        .foregroundStyle(.primary) // <- ensures black text
                        .padding(.vertical, 14)

                    Spacer()
                }
                .padding(.horizontal, 16)
                .background(Color.black.opacity(0.03))
                .clipShape(RoundedRectangle(cornerRadius: 18))
                .overlay(RoundedRectangle(cornerRadius: 18).stroke(Color.black.opacity(0.06)))

                // Form card
                VStack(spacing: 12) {
                    Labeled("From account") {
                        Picker("", selection: $fromAccountId) {
                            ForEach(store.accounts) { a in
                                Text("\(a.name) (••• \(a.last4)) • £\(a.balance, specifier: "%.2f")")
                                    .tag(a.id)
                            }
                        }
                        .pickerStyle(.menu)
                    }

                    Labeled("Recipient name") {
                        TextField("John Smith", text: $recipientName)
                            .foregroundStyle(.primary) // black
                    }

                    HStack(spacing: 12) {
                        Labeled("Sort code") {
                            TextField("12-34-56", text: $sortCode)
                                .keyboardType(.numbersAndPunctuation)
                                .foregroundStyle(.primary)
                        }
                        Labeled("Account number") {
                            TextField("12345678", text: $accountNumber)
                                .keyboardType(.numberPad)
                                .foregroundStyle(.primary)
                        }
                    }

                    Labeled("Reference") {
                        TextField("Rent / Bills", text: $reference)
                            .foregroundStyle(.primary)
                    }

                    Button {
                        submit()
                    } label: {
                        Text("Confirm transfer")
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(LinearGradient(colors: [.blue, .purple], startPoint: .leading, endPoint: .trailing))
                            .foregroundStyle(.white)
                            .clipShape(RoundedRectangle(cornerRadius: 16))
                            .bold()
                    }
                    .padding(.top, 6)

                    if let error {
                        Text(error)
                            .foregroundStyle(.red)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .padding(.top, 2)
                    }
                }
                .padding(16)
                .background(.white)
                .clipShape(RoundedRectangle(cornerRadius: 22))
                .overlay(RoundedRectangle(cornerRadius: 22).stroke(Color.black.opacity(0.06)))
                .shadow(color: .black.opacity(0.06), radius: 18, y: 10)
            }
            .padding(16)
        }
        .navigationTitle("")
        .navigationBarTitleDisplayMode(.inline)
        .onAppear {
            if fromAccountId.isEmpty { fromAccountId = store.accounts.first?.id ?? "" }
            if let prefilledRecipient, recipientName.isEmpty { recipientName = prefilledRecipient }
        }
        .navigationDestination(isPresented: $showConfirmation) {
            TransferConfirmationView(recipientName: confirmedName, amount: confirmedAmount) {
                dismiss() // close back to SendMoney modal list
            }
        }
    }

    private func submit() {
        error = nil

        let name = recipientName.trimmingCharacters(in: .whitespacesAndNewlines)
        if name.isEmpty { error = "Recipient name is required."; return }

        if !isValidSortCode(sortCode) { error = "Sort code must be in format 12-34-56."; return }

        let accNo = accountNumber.filter(\.isNumber)
        if accNo.count != 8 { error = "Account number must be 8 digits."; return }

        let amt = Double(amountText.replacingOccurrences(of: ",", with: ".")) ?? 0
        if amt <= 0 { error = "Enter a valid amount."; return }

        store.submitTransfer(fromAccountId: fromAccountId, recipientName: name, amount: amt, reference: reference)

        confirmedName = name
        confirmedAmount = amt
        showConfirmation = true
    }

    private func isValidSortCode(_ sc: String) -> Bool {
        let cleaned = sc.trimmingCharacters(in: .whitespacesAndNewlines)
        // Accept "123456" or "12-34-56"
        let digits = cleaned.filter(\.isNumber)
        if digits.count != 6 { return false }
        if cleaned.contains("-") {
            // basic format check
            return cleaned.count >= 8
        }
        return true
    }
}

struct Labeled<Content: View>: View {
    let title: String
    @ViewBuilder let content: Content

    init(_ title: String, @ViewBuilder content: () -> Content) {
        self.title = title
        self.content = content()
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title).font(.headline)
            content
                .padding(12)
                .background(Color.black.opacity(0.03))
                .clipShape(RoundedRectangle(cornerRadius: 14))
                .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color.black.opacity(0.06)))
        }
    }
}
