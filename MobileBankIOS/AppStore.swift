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
//  AppStore.swift
//  MobileBankIOS
//
//  Created by Rania Fadiel on 04/02/2026.
//
import Foundation

@MainActor
final class BankStore: ObservableObject {

    @Published var session: Session
    @Published var profile: UserProfile
    @Published var accounts: [BankAccount]
    @Published var transactions: [Transaction]

    // MARK: - Safety & Security
    @Published var cards: [PaymentCard]
    @Published var fraudAlerts: [FraudAlert]
    @Published var trustedContacts: [TrustedContact]
    @Published var loginHistory: [LoginEvent]

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

        self.cards = [
            PaymentCard(id: "card-001", name: "Everyday Debit", last4: "1024", isFrozen: false,
                        dailyLimit: 1500, contactlessEnabled: true, onlineEnabled: true, atmEnabled: true),
            PaymentCard(id: "card-002", name: "Savings Card", last4: "7788", isFrozen: false,
                        dailyLimit: 500, contactlessEnabled: false, onlineEnabled: true, atmEnabled: true)
        ]
        
        
        self.fraudAlerts = [
            FraudAlert(
                id: UUID().uuidString,
                date: Date().addingTimeInterval(-3600 * 5),
                title: "Unknown Merchant — Lagos, NG",
                detail: "Unusual location detected on card ••1024.",
                resolved: false
            )
        ]

//        self.fraudAlerts = [
//            FraudAlert(id: UUID().uuidString, date: Date().addingTimeInterval(-3600 * 5),
//                       merchant: "Unknown Merchant — Lagos, NG", amount: 220.00,
//                       message: "Unusual location detected on card ••1024.", resolved: false)
        

        self.trustedContacts = [
            TrustedContact(id: UUID().uuidString, name: "Sara", relation: "Daughter",
                           phone: "+44 7700 900111", initials: "S")
        ]

        //self.loginHistory = [
           // LoginEvent(id: UUID().uuidString, date: Date().addingTimeInterval(-3600 * 2),
                       //device: "iPhone 15 Pro", location: "London, UK", suspicious: true),
           // LoginEvent(id: UUID().uuidString, date: Date().addingTimeInterval(-86400),
                       //device: "iPhone 15 Pro", location: "London, UK", suspicious: true),
           // LoginEvent(id: UUID().uuidString, date: Date().addingTimeInterval(-86400 * 2),
                       //device: "Unknown Device", location: "Lagos, NG", suspicious: false)
        //]
        
        self.loginHistory = [
            LoginEvent(
                id: UUID().uuidString,
                date: Date().addingTimeInterval(-3600 * 2),
                device: "iPhone 15 Pro",
                location: "London, UK",
                suspicious: false
            ),
            LoginEvent(
                id: UUID().uuidString,
                date: Date().addingTimeInterval(-86400),
                device: "iPhone 15 Pro",
                location: "London, UK",
                suspicious: false
            ),
            LoginEvent(
                id: UUID().uuidString,
                date: Date().addingTimeInterval(-86400 * 2),
                device: "Unknown Device",
                location: "Lagos, NG",
                suspicious: true
            )
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

    // MARK: - Card controls
    func toggleFreeze(cardId: String) {
        guard let i = cards.firstIndex(where: { $0.id == cardId }) else { return }
        cards[i].isFrozen.toggle()
    }

    func setDailyLimit(cardId: String, limit: Double) {
        guard let i = cards.firstIndex(where: { $0.id == cardId }) else { return }
        cards[i].dailyLimit = max(0, limit)
    }

    func setCardToggle(cardId: String, keyPath: WritableKeyPath<PaymentCard, Bool>, value: Bool) {
        guard let i = cards.firstIndex(where: { $0.id == cardId }) else { return }
        cards[i][keyPath: keyPath] = value
    }

    // MARK: - Fraud
    func resolveAlert(id: String) {
        guard let i = fraudAlerts.firstIndex(where: { $0.id == id }) else { return }
        fraudAlerts[i].resolved = true
    }

    // MARK: - Trusted contacts
    func addTrustedContact(name: String, relation: String, phone: String) {
        let initials = String(name.prefix(1)).uppercased()
        trustedContacts.append(
            TrustedContact(id: UUID().uuidString, name: name, relation: relation,
                           phone: phone, initials: initials.isEmpty ? "?" : initials)
        )
    }

    func removeTrustedContact(id: String) {
        trustedContacts.removeAll { $0.id == id }
    }

    // MARK: - Security score
    var securityScore: Int {
        let unresolved = fraudAlerts.filter { !$0.resolved }.count
        let frozenBonus = cards.contains(where: { $0.isFrozen }) ? 5 : 0
        let contactsBonus = trustedContacts.isEmpty ? 0 : 25
        return min(100, 50 + contactsBonus + frozenBonus + (unresolved == 0 ? 20 : 5))
    }
}








//import Foundation
//
//@MainActor
//final class BankStore: ObservableObject {
//
//    @Published var session: Session
//    @Published var profile: UserProfile
//    @Published var accounts: [BankAccount]
//    @Published var transactions: [Transaction]
//
//    let demoEmail = "demo@mobilebank.test"
//    let demoPassword = "Demo1234"
//
//    init() {
//        self.session = Session(isAuthenticated: false, email: "")
//        self.profile = UserProfile(
//            fullName: "Rania",
//            email: demoEmail,
//            phone: "+44 7700 900000",
//            address: "London, United Kingdom"
//        )
//
//        self.accounts = [
//            BankAccount(id: "acc-001", name: "Everyday Current", last4: "1024", balance: 5218.55, currency: "£"),
//            BankAccount(id: "acc-002", name: "Savings", last4: "7788", balance: 4120.00, currency: "£")
//        ]
//
//        self.transactions = [
//            Transaction(id: UUID().uuidString, date: Date().addingTimeInterval(-86400 * 1), merchant: "Apple Store", category: "Electronics", type: .card, amount: -199.99, note: "Card purchase"),
//            Transaction(id: UUID().uuidString, date: Date().addingTimeInterval(-86400 * 1), merchant: "Salary Deposit", category: "Monthly salary", type: .salary, amount: 3500.00, note: "Incoming salary"),
//            Transaction(id: UUID().uuidString, date: Date().addingTimeInterval(-86400 * 2), merchant: "Starbucks", category: "Coffee", type: .card, amount: -5.50, note: "Coffee"),
//            Transaction(id: UUID().uuidString, date: Date().addingTimeInterval(-86400 * 2), merchant: "Netflix", category: "Subscription", type: .bills, amount: -15.99, note: "Pending"),
//            Transaction(id: UUID().uuidString, date: Date().addingTimeInterval(-86400 * 3), merchant: "Uber", category: "Transport", type: .card, amount: -23.40, note: "Ride"),
//            Transaction(id: UUID().uuidString, date: Date().addingTimeInterval(-86400 * 3), merchant: "The Burger Joint", category: "Restaurant", type: .card, amount: -42.50, note: "Dinner")
//        ]
//    }
//
//    func login(email: String, password: String) -> Bool {
//        let ok = (email.lowercased().trimmingCharacters(in: .whitespacesAndNewlines) == demoEmail)
//        && (password == demoPassword)
//
//        if ok {
//            session.isAuthenticated = true
//            session.email = demoEmail
//            profile.email = demoEmail
//        }
//        return ok
//    }
//
//    func logout() {
//        session.isAuthenticated = false
//        session.email = ""
//    }
//
//    func submitTransfer(fromAccountId: String, recipientName: String, amount: Double, reference: String) {
//        guard amount > 0 else { return }
//        guard let idx = accounts.firstIndex(where: { $0.id == fromAccountId }) else { return }
//
//        accounts[idx].balance = max(0, accounts[idx].balance - amount)
//
//        let tx = Transaction(
//            id: UUID().uuidString,
//            date: Date(),
//            merchant: "Transfer to \(recipientName)",
//            category: "Transfer",
//            type: .transfer,
//            amount: -amount,
//            note: reference.isEmpty ? "Bank transfer" : "Ref: \(reference)"
//        )
//        transactions.insert(tx, at: 0)
//    }
//}
