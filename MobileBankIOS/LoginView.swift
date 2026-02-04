
//  LoginView.swift
//  MobileBankIOS
//
//  Created by Rania Fadiel on 03/02/2026.

import SwiftUI

struct LoginView: View {
    @EnvironmentObject var store: BankStore

    @State private var email = ""
    @State private var password = ""
    @State private var error: String?

    var body: some View {
        ZStack {
            LinearGradient(colors: [Color(red: 0.05, green: 0.12, blue: 0.25), Color(red: 0.03, green: 0.07, blue: 0.12)],
                           startPoint: .topLeading, endPoint: .bottomTrailing)
            .ignoresSafeArea()

            VStack(spacing: 18) {
                HStack(spacing: 10) {
                    Circle()
                        .fill(LinearGradient(colors: [.blue, .purple], startPoint: .topLeading, endPoint: .bottomTrailing))
                        .frame(width: 44, height: 44)
                        .overlay(Text("MB").foregroundStyle(.white).bold())

                    VStack(alignment: .leading, spacing: 2) {
                        Text("MobileBank").foregroundStyle(.white).bold()
                        Text("Prototype (IPD)").foregroundStyle(.white.opacity(0.7)).font(.caption)
                    }
                    Spacer()
                }
                ;
                VStack(alignment: .leading, spacing: 6) {
                    Text("Sign in").font(.largeTitle).bold().foregroundStyle(.white)
                    Text("Use demo credentials to access the prototype.")
                        .foregroundStyle(.white.opacity(0.75))
                        .font(.subheadline)
                }
                .frame(maxWidth: .infinity, alignment: .leading)

                VStack(spacing: 12) {
                    TextField("e.g. demo@mobilebank.test", text: $email)
                        .textInputAutocapitalization(.never)
                        .keyboardType(.emailAddress)
                        .padding()
                        .background(.white.opacity(0.08))
                        .clipShape(RoundedRectangle(cornerRadius: 14))
                        .foregroundStyle(.white)

                    SecureField("e.g. Demo1234", text: $password)
                        .padding()
                        .background(.white.opacity(0.08))
                        .clipShape(RoundedRectangle(cornerRadius: 14))
                        .foregroundStyle(.white)

                    Button {
                        error = nil
                        let ok = store.login(email: email, password: password)
                        if !ok { error = "Invalid credentials. Use demo@mobilebank.test / Demo1234" }
                    } label: {
                        Text("Login")
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(LinearGradient(colors: [.blue, .purple], startPoint: .leading, endPoint: .trailing))
                            .foregroundStyle(.white)
                            .clipShape(RoundedRectangle(cornerRadius: 14))
                            .bold()
                    }

                    VStack(alignment: .leading, spacing: 6) {
                        Text("Demo: \(store.demoEmail) / \(store.demoPassword)")
                            .font(.callout).foregroundStyle(.white.opacity(0.9))
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding()
                    .overlay(
                        RoundedRectangle(cornerRadius: 14)
                            .strokeBorder(.white.opacity(0.2), style: StrokeStyle(lineWidth: 1, dash: [6]))
                    )
                }

                if let error {
                    Text(error)
                        .foregroundStyle(.red.opacity(0.95))
                        .padding(.top, 4)
                }

                Spacer(minLength: 10)

                Text("IPD Prototype • Client-side only • No real banking data")
                    .font(.caption)
                    .foregroundStyle(.white.opacity(0.65))
            }
            .padding(22)
            .frame(maxWidth: 520)
            .background(.white.opacity(0.06))
            .clipShape(RoundedRectangle(cornerRadius: 24))
            .overlay(
                RoundedRectangle(cornerRadius: 24)
                    .strokeBorder(.white.opacity(0.12), lineWidth: 1)
            )
            .padding()
        }
    }
}
