//
//  TransferConfirmationView.swift
//  MobileBankIOS
//
//  Created by Rania Fadiel on 04/02/2026.
//
//
//  TransferConfirmationView.swift
//  MobileBankIOS
//
//  Created by Rania Fadiel on 03/02/2026.
//

import SwiftUI

struct TransferConfirmationView: View {
    let recipientName: String
    let amount: Double
    let onDone: () -> Void

    var body: some View {
        VStack(spacing: 16) {
            Spacer()

            Image(systemName: "checkmark.circle.fill")
                .font(.system(size: 70, weight: .bold))
                .foregroundStyle(.green)

            Text("Transfer sent")
                .font(.largeTitle).bold()

            Text("£\(amount, specifier: "%.2f") has been sent to \(recipientName).")
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal)

            Spacer()

            Button {
                onDone()
            } label: {
                Text("Done")
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(LinearGradient(colors: [.blue, .purple], startPoint: .leading, endPoint: .trailing))
                    .foregroundStyle(.white)
                    .clipShape(RoundedRectangle(cornerRadius: 16))
                    .bold()
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 20)
        }
        .navigationBarBackButtonHidden(true)
    }
}
