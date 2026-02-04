//
//  AppStore.swift
//  MobileBankIOS
//
//  Created by Rania Fadiel on 04/02/2026.
//
//
//  AppStore.swift
//  MobileBankIOS
//
//  Created by Rania Fadiel on 03/02/2026.
//
import Foundation

@MainActor
final class BankStore: ObservableObject {

    @Published var session: Session
    @Published var profile: UserProfile
    @Published var accounts: [BankAccount]
    @Published var transactions: [Transaction]

    let demoEmail = "demo@mobilebank.test"
    let demoPassword = "Demo1234"

    init() {
        self.session = Session(isAuthenticated: false, email: "")
        self.profile = UserProfile(
            fullName: "Rania",
            email: demoEmail,
            phone: "+44 7700 900000",
            address: "London, United Kingdom"
        )

        self.accounts = [
            BankAccount(id: "acc-001", name: "Everyday Current", last4: "1024", balance: 5218.55, currency: "£"),
            BankAccount(id: "acc-002", name: "Savings", last4: "7788", balance: 4120.00, currency: "£")
        ]

        self.transactions = [
            Transaction(id: UUID().uuidString, date: Date().addingTimeInterval(-86400 * 1), merchant: "Apple Store", category: "Electronics", type: .card, amount: -199.99, note: "Card purchase"),
            Transaction(id: UUID().uuidString, date: Date().addingTimeInterval(-86400 * 1), merchant: "Salary Deposit", category: "Monthly salary", type: .salary, amount: 3500.00, note: "Incoming salary"),
            Transaction(id: UUID().uuidString, date: Date().addingTimeInterval(-86400 * 2), merchant: "Starbucks", category: "Coffee", type: .card, amount: -5.50, note: "Coffee"),
            Transaction(id: UUID().uuidString, date: Date().addingTimeInterval(-86400 * 2), merchant: "Netflix", category: "Subscription", type: .bills, amount: -15.99, note: "Pending"),
            Transaction(id: UUID().uuidString, date: Date().addingTimeInterval(-86400 * 3), merchant: "Uber", category: "Transport", type: .card, amount: -23.40, note: "Ride"),
            Transaction(id: UUID().uuidString, date: Date().addingTimeInterval(-86400 * 3), merchant: "The Burger Joint", category: "Restaurant", type: .card, amount: -42.50, note: "Dinner")
        ]
    }

    func login(email: String, password: String) -> Bool {
        let ok = (email.lowercased().trimmingCharacters(in: .whitespacesAndNewlines) == demoEmail)
        && (password == demoPassword)

        if ok {
            session.isAuthenticated = true
            session.email = demoEmail
            profile.email = demoEmail
        }
        return ok
    }

    func logout() {
        session.isAuthenticated = false
        session.email = ""
    }

    func submitTransfer(fromAccountId: String, recipientName: String, amount: Double, reference: String) {
        guard amount > 0 else { return }
        guard let idx = accounts.firstIndex(where: { $0.id == fromAccountId }) else { return }

        accounts[idx].balance = max(0, accounts[idx].balance - amount)

        let tx = Transaction(
            id: UUID().uuidString,
            date: Date(),
            merchant: "Transfer to \(recipientName)",
            category: "Transfer",
            type: .transfer,
            amount: -amount,
            note: reference.isEmpty ? "Bank transfer" : "Ref: \(reference)"
        )
        transactions.insert(tx, at: 0)
    }
}
