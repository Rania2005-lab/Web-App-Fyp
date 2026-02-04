//
//  ProfileSheet.swift
//  MobileBankIOS
//
//  Created by Rania Fadiel on 04/02/2026.
//

//
//  ProfileSheet.swift
//  MobileBankIOS
//
//  Created by Rania Fadiel on 03/02/2026.
//
import SwiftUI

struct ProfileSheet: View {
    @EnvironmentObject var store: BankStore
    @Environment(\.dismiss) private var dismiss

    @State private var name = ""
    @State private var phone = ""
    @State private var address = ""
    @State private var saved = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 14) {
                    Text("Profile").font(.largeTitle).bold()
                    Text("Update personal details stored locally (demo purposes).")
                        .foregroundStyle(.secondary)

                    VStack(spacing: 12) {
                        field(title: "Full name", text: $name, placeholder: "Your name")
                        field(title: "Phone", text: $phone, placeholder: "+44 ...", keyboard: .phonePad)
                        field(title: "Address", text: $address, placeholder: "City, Country")

                        Button {
                            store.profile.fullName = name
                            store.profile.phone = phone
                            store.profile.address = address
                            saved = true
                        } label: {
                            Text("Save changes")
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(LinearGradient(colors: [.blue, .purple], startPoint: .leading, endPoint: .trailing))
                                .foregroundStyle(.white)
                                .clipShape(RoundedRectangle(cornerRadius: 16))
                                .bold()
                        }

                        if saved {
                            Text("Profile saved (prototype).")
                                .foregroundStyle(.green)
                                .padding(12)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .background(Color.green.opacity(0.10))
                                .clipShape(RoundedRectangle(cornerRadius: 14))
                        }

                        Divider().padding(.top, 4)

                        HStack {
                            Button("Logout") { store.logout() }
                                .buttonStyle(.bordered)

                            Spacer()

                            Text(store.session.email.isEmpty ? store.profile.email : store.session.email)
                                .font(.footnote).bold()
                                .padding(.horizontal, 12)
                                .padding(.vertical, 8)
                                .background(Color.black.opacity(0.05))
                                .clipShape(Capsule())
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
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") { dismiss() }
                }
            }
            .onAppear {
                name = store.profile.fullName
                phone = store.profile.phone
                address = store.profile.address
            }
        }
    }

    private func field(title: String,
                       text: Binding<String>,
                       placeholder: String,
                       keyboard: UIKeyboardType = .default) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title).font(.headline)
            TextField(placeholder, text: text)
                .keyboardType(keyboard)
                .foregroundStyle(.primary) // <- BLACK typing
                .padding(12)
                .background(Color.black.opacity(0.03))
                .clipShape(RoundedRectangle(cornerRadius: 14))
                .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color.black.opacity(0.06)))
        }
    }
}
