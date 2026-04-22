//
//  Models.swift
//  MobileBankIOS
//
//  Created by Rania Fadiel on 04/02/2026.
//
import Foundation

struct Session: Codable {
    var isAuthenticated: Bool
    var email: String
}

struct UserProfile: Codable {
    var fullName: String
    var email: String
    var phone: String
    var address: String
}

struct BankAccount: Identifiable, Codable, Hashable {
    var id: String
    var name: String
    var last4: String
    var balance: Double
    var currency: String
}

enum TransactionKind: String, Codable, CaseIterable {
    case card
    case salary
    case bills
    case transfer
}

struct Transaction: Identifiable, Codable, Hashable {
    var id: String
    var date: Date
    var merchant: String
    var category: String
    var type: TransactionKind
    var amount: Double
    var note: String
}


// MARK: - Safety & Security

struct PaymentCard: Identifiable, Codable, Hashable {
    var id: String
    var name: String
    var last4: String
    var isFrozen: Bool
    var dailyLimit: Double
    var contactlessEnabled: Bool
    var onlineEnabled: Bool
    var atmEnabled: Bool
}

struct LoginEvent: Identifiable, Codable, Hashable {
    var id: String
    var date: Date
    var device: String
    var location: String
    var suspicious: Bool
}

struct FraudAlert: Identifiable, Codable, Hashable {
    var id: String
    var date: Date
    var title: String
    var detail: String
    var resolved: Bool
}

struct TrustedContact: Identifiable, Codable, Hashable {
    var id: String
    var name: String
    var relation: String
    var phone: String
    var initials: String
}
