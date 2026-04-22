//
//  TrustedContactSheet.swift
//  MobileBankIOS
//
//  Created by Rania Fadiel on 21/04/2026.
//

//
//  TrustedContactsSheet.swift
//  MobileBankIOS
//

import SwiftUI

struct TrustedContactsSheet: View {
    @EnvironmentObject var store: BankStore
    @Environment(\.dismiss) private var dismiss
    @State private var newName = ""
    @State private var newRelation = ""
    @State private var newPhone = ""

    var body: some View {
        NavigationStack {
            ZStack {
                Theme.bg.ignoresSafeArea()
                ScrollView {
                    VStack(spacing: 14) {
                        Text("In an emergency you can call any of these contacts in one tap.")
                            .font(.subheadline).foregroundStyle(Theme.textMuted)
                            .frame(maxWidth: .infinity, alignment: .leading)

                        ForEach(store.trustedContacts) { c in
                            HStack(spacing: 12) {
                                Circle().fill(Theme.accent.opacity(0.2))
                                    .frame(width: 44, height: 44)
                                    .overlay(Text(c.initials).foregroundStyle(Theme.accent).bold())
                                VStack(alignment: .leading, spacing: 2) {
                                    Text(c.name).foregroundStyle(.white).bold()
                                    Text("\(c.relation) · \(c.phone)")
                                        .font(.caption).foregroundStyle(Theme.textMuted)
                                }
                                Spacer()
                                Button {
                                    call(c.phone)
                                } label: {
                                    Image(systemName: "phone.fill").foregroundStyle(.white)
                                        .padding(10).background(Theme.success).clipShape(Circle())
                                }
                            }
                            .padding(12)
                            .background(Theme.bgElevated)
                            .clipShape(RoundedRectangle(cornerRadius: 14))
                        }

                        VStack(alignment: .leading, spacing: 10) {
                            Text("Add Contact").foregroundStyle(.white).bold()
                            field("Name", $newName)
                            field("Relation (e.g. Daughter)", $newRelation)
                            field("Phone (+44...)", $newPhone)
                            Button {
                                guard !newName.isEmpty, !newPhone.isEmpty else { return }
                                store.trustedContacts.append(
                                    TrustedContact(id: UUID().uuidString, name: newName,
                                                   relation: newRelation.isEmpty ? "Family" : newRelation,
                                                   phone: newPhone,
                                                   initials: String(newName.prefix(1)).uppercased())
                                )
                                newName = ""; newRelation = ""; newPhone = ""
                            } label: {
                                Text("Add contact").bold().frame(maxWidth: .infinity).padding()
                                    .background(Theme.accent).foregroundStyle(.white)
                                    .clipShape(RoundedRectangle(cornerRadius: 14))
                            }
                        }
                        .darkCard()
                    }
                    .padding()
                }
            }
            .navigationTitle("Trusted Contacts")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") { dismiss() }.tint(Theme.accent)
                }
            }
        }
    }

    private func field(_ placeholder: String, _ text: Binding<String>) -> some View {
        TextField("", text: text, prompt: Text(placeholder).foregroundStyle(Theme.textMuted))
            .foregroundStyle(.white).padding(12)
            .background(Theme.bg).clipShape(RoundedRectangle(cornerRadius: 12))
    }

    private func call(_ phone: String) {
        let digits = phone.filter { "+0123456789".contains($0) }
        if let url = URL(string: "tel://\(digits)") { UIApplication.shared.open(url) }
    }
}
