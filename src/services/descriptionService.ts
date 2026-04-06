export interface StatusExplanation {
  label: string;
  explanation: string;
}

export interface TableDescription {
  heading: string;
  description: string;
  usageTip?: string;
  statuses?: StatusExplanation[];
}

export type TableDescriptions = Record<string, TableDescription>;

export const mockDescriptions: Record<string, TableDescriptions> = {
  'collections': {
    accountNumber: {
      heading: 'Account Number',
      description: 'A unique alphanumeric identifier assigned to each collection account for tracking and reference throughout the system.',
      usageTip: 'Use this number when searching for specific patient records.'
    },
    patientName: {
      heading: 'Patient Name',
      description: 'The full legal name of the patient as registered in the electronic health record (EHR) system.',
    },
    payer: {
      heading: 'Payer',
      description: 'The entity responsible for the majority of the payment, typically an insurance company or a government program like Medicare/Medicaid.',
    },
    totalDue: {
      heading: 'Total Due',
      description: 'The total monetary value billed for the services rendered, before any payments or adjustments are applied.',
    },
    amountCollected: {
      heading: 'Amount Collected',
      description: 'The total sum of all payments received from both the primary payer and the patient for this account.',
    },
    balance: {
      heading: 'Balance',
      description: 'The current outstanding amount on the account, calculated as (Total Due + Adjustments) - Amount Collected.',
      usageTip: 'Monitor high balance accounts for immediate follow-up.'
    },
    lastActivityDate: {
      heading: 'Last Activity',
      description: 'The most recent date when any activity, such as a phone call, payment, or status change, occurred on this collection account.',
    },
    assignedTo: {
      heading: 'Assigned To',
      description: 'The individual staff member or department currently assigned to manage the recovery efforts for this account.',
    },
    aging: {
      heading: 'Aging Bucket',
      description: 'The classification of the account based on the number of days since the original invoice or last payment (e.g., 30-60 days).',
    },
    priority: {
      heading: 'Priority Level',
      description: 'A risk-based classification (High, Medium, Low) determining the frequency and method of follow-up required.',
    },
    description: {
      heading: 'Description',
      description: 'Additional notes or context regarding the collection account status or patient communication history.',
    },
    status: {
      heading: 'Account Status',
      description: 'The current state of the account within the collections lifecycle.',
      statuses: [
        { label: 'Open', explanation: 'The account is active and awaiting initial payment or action.' },
        { label: 'In Progress', explanation: 'A collector is actively working on the account or a payment plan is established.' },
        { label: 'Settled', explanation: 'The outstanding balance has been resolved via payment or approved write-off.' },
        { label: 'Closed', explanation: 'The account is no longer active and no further collections will be attempted.' }
      ]
    }
  },
  'all-transactions': {
    effectiveDate: {
      heading: 'Effective Date',
      description: 'The official date on which the transaction is recognized for accounting and reporting purposes, which may differ from the actual entry date.',
    },
    transactionType: {
      heading: 'Transaction Category',
      description: 'The high-level type of transaction, such as Payment, Recoupment, Adjustment, or PIP.',
    },
    type: {
      heading: 'Transaction Type',
      description: 'A more detailed sub-classification of the transaction, such as Claim Payment, EFT, or Manual Check.',
    },
    description: {
      heading: 'Description',
      description: 'Additional context providing specific details about the transaction, such as a claim ID or memo field.',
    },
    sourceProvider: {
      heading: 'Source / Provider',
      description: 'The laboratory, clinic, or insurance provider associated with the origin of this transaction record.',
    },
    amount: {
      heading: 'Amount',
      description: 'The gross dollar amount of the transaction. Negative values indicate deductions or refunds.',
    },
    openBalance: {
      heading: 'Open Balance',
      description: 'The portion of the transaction amount that has not yet been applied to a specific claim or reconciliation record.',
    },
    status: {
      heading: 'Transaction Status',
      description: 'The current status of the transaction in the reconciliation workflow.',
      statuses: [
        { label: 'Reconciled', explanation: 'The transaction has been perfectly matched with an offsetting entry (e.g., bank deposit).' },
        { label: 'Open', explanation: 'The transaction is awaiting reconciliation or application to a claim.' },
        { label: 'Pending', explanation: 'The transaction is in an intermediate state, possibly awaiting bulk posting.' },
        { label: 'Partially Applied', explanation: 'Only a portion of the transaction amount has been allocated to claims.' },
        { label: 'Disputed', explanation: 'The transaction is under investigation due to a discrepancy in amount or data.' }
      ]
    }
  },
  'bank-deposits': {
    reference: {
      heading: 'Reference / Date',
      description: 'The unique reference number provided by the bank for the deposit, along with the date the funds were credited.',
    },
    payerName: {
      heading: 'Payer Name',
      description: 'The name of the insurance company or organization responsible for the deposited funds.',
    },
    bankAmt: {
      heading: 'Bank Amount',
      description: 'The actual dollar amount that appeared on the bank statement for this deposit.',
    },
    remitAmt: {
      heading: 'Remit Amount',
      description: 'The sum of all remittance advice amounts that have been linked to this bank deposit.',
    },
    variance: {
      heading: 'Variance',
      description: 'The discrepancy between the bank deposit amount and the total remittance amount. Ideally, this should be zero.',
    },
    description: {
      heading: 'Description',
      description: 'Additional context or identifying information for the bank deposit record, typically sourced from the bank statement or post-reconciliation memos.',
    },
    status: {
      heading: 'Reconciliation Status',
      description: 'Indicates the match quality between bank and remit data.',
      statuses: [
        { label: 'Matched', explanation: 'The bank deposit amount exactly equals the sum of associated remittances.' },
        { label: 'Unmatched', explanation: 'There is a variance between the bank statement and the available remittance data.' },
        { label: 'Partially Matched', explanation: 'Some remittances have been identified, but a variance remains.' }
      ]
    }
  },
  'statements': {
    statementDate: {
      heading: 'Statement Date',
      description: 'The date on which the periodical statement was produced for the recipient.',
    },
    statementNumber: {
      heading: 'Statement Number',
      description: 'The unique alphanumeric identifier for this statement document.',
    },
    beginningBalance: {
      heading: 'Beginning Balance',
      description: 'The total amount due at the start of the current statement period, carried over from the previous statement.',
    },
    endingBalance: {
      heading: 'Ending Balance',
      description: 'The final amount due after all payments, adjustments, and new charges for the period have been applied.',
    },
    ptan: {
      heading: 'PTAN',
      description: 'The unique identification number assigned to a provider upon enrollment in Medicare.',
    },
    paymentDate: {
      heading: 'Payment Date',
      description: 'The calendar date on which the periodic interim payment was generated and issued.',
    },
    checkEftNumber: {
      heading: 'Check/EFT #',
      description: 'The unique reference number for the physical check or electronic funds transfer associated with the statement.',
    },
    paymentAmount: {
      heading: 'Payment Amount',
      description: 'The gross monetary value issued for this periodic interim payment record.',
    },
    suspenseBalance: {
      heading: 'Suspense Balance',
      description: 'Monetary amounts that have been received but not yet matched or applied to specific claims due to missing or conflicting information.',
    },
    noticeId: {
      heading: 'Notice ID',
      description: 'The unique reference number for the overpayment or forward balance notification.',
    },
    notificationDate: {
      heading: 'Notification Date',
      description: 'The date on which the provider was officially notified of the overpayment or balance due.',
    },
    originalAmount: {
      heading: 'Original Amount',
      description: 'The total value of the overpayment as identified at the time of notification.',
    },
    remainingBalance: {
      heading: 'Remaining Balance',
      description: 'The portion of the overpayment that has not yet been recovered through subsequent payment offsets.',
    },
    description: {
      heading: 'Description',
      description: 'Detailed info about the statement record, providing context for the balance or specific period notices.',
    },
    status: {
      heading: 'Status',
      description: 'The processing or allocation status of the PIP or FB record.',
      statuses: [
        { label: 'Allocated', explanation: 'The funds have been fully distributed to specific NPIs or claims.' },
        { label: 'Pending', explanation: 'The system is awaiting further data to complete the allocation.' },
        { label: 'Active', explanation: 'For FB Notices, the notice is currently being withheld from current payments.' },
        { label: 'Satisfied', explanation: 'The debt described in the notice has been fully recovered.' }
      ]
    }
  },
  'variance-analysis': {
    allowedAmount: {
      heading: 'Allowed Amount',
      description: 'The maximum amount the insurance company will cover for a service based on the fee schedule.',
    },
    paidAmount: {
      heading: 'Paid Amount',
      description: 'The actual dollar amount paid by the insurance company for the claim.',
    },
    variance: {
      heading: 'Variance',
      description: 'The discrepancy between the contracted allowed amount and the actual paid amount.',
      usageTip: 'High variance indicates potential underpayments or billing errors.'
    },
    description: {
      heading: 'Description',
      description: 'The reasoning or context behind the variance, often including specific billing codes or payer remark summaries.',
    }
  },
  'recoupments': {
    recoupmentId: {
      heading: 'Recoupment ID',
      description: 'A unique alphanumeric ID assigned to the recoupment record for tracking and reference.',
    },
    payer: {
      heading: 'Payer',
      description: 'The entity responsible for initiating the recoupment action, typically an insurance carrier correcting a prior overpayment.',
    },
    claim: {
      heading: 'Claim / Patient',
      description: 'The specific claim ID and patient name from which the funds are being recouped.',
    },
    originalPaymentAmount: {
      heading: 'Original Payment',
      description: 'The dollar amount that was originally paid for the claim before the recoupment was initiated.',
    },
    recoupmentAmount: {
      heading: 'Recoupment Amount',
      description: 'The specific dollar amount that the payer is taking back. This is usually shown as a negative value.',
    },
    recoupmentDate: {
      heading: 'Date',
      description: 'The calendar date on which the recoupment transaction was processed or recognized.',
    },
    reason: {
      heading: 'Reason',
      description: 'A description provided by the payer explaining why the funds are being recouped (e.g., overpayment, duplicate claim).',
    },
    description: {
      heading: 'Description',
      description: 'Context explaining the specific recoupment event, often linking back to the original claim dispute or overpayment notice.',
    },
    status: {
      heading: 'Status',
      description: 'The current state of the recoupment.',
      statuses: [
        { label: 'Processed', explanation: 'The recoupment has been successfully applied to the current payment cycle.' },
        { label: 'Pending', explanation: 'The recoupment is identified but not yet deducted from a check.' },
        { label: 'Disputed', explanation: 'The provider has challenged the validity of the recoupment.' }
      ]
    }
  },
  'other-adjustments': {
    adjustmentId: {
      heading: 'Adjustment ID',
      description: 'A unique alphanumeric ID assigned to the adjustment record.',
    },
    effectiveDate: {
      heading: 'Effective Date',
      description: 'The official date on which the adjustment is recognized for accounting purposes.',
    },
    type: {
      heading: 'Adjustment Type',
      description: 'The category of the adjustment, such as Write-off, Credit, Interest, or Refund.',
    },
    description: {
      heading: 'Description',
      description: 'Additional context or reasoning for the adjustment record.',
    },
    sourceProvider: {
      heading: 'Source / Provider',
      description: 'The provider or system responsible for initiating this financial adjustment.',
    },
    amount: {
      heading: 'Amount',
      description: 'The dollar value of the adjustment. Positive for credits, negative for debits or write-offs.',
    },
    referenceId: {
      heading: 'Reference ID',
      description: 'A secondary identifier or reference number related to this adjustment (e.g., invoice #).',
    },
    status: {
      heading: 'Status',
      description: 'The ledger status of the adjustment.',
      statuses: [
        { label: 'Applied', explanation: 'The adjustment has been finalized and posted to the patient or payer ledger.' },
        { label: 'Pending', explanation: 'The adjustment is awaiting approval or processing.' },
        { label: 'Under Review', explanation: 'Management is reviewing the adjustment for validity or compliance.' }
      ]
    }
  },
  'service-lines': {
    lineNo: {
      heading: 'Line #',
      description: 'The index or line number of the specific service item within the claim.',
    },
    procCode: {
      heading: 'Proc Code',
      description: 'The standardized code (e.g., CPT or HCPCS) used to identify the medical service provided.',
    },
    revCode: {
      heading: 'Rev Code',
      description: 'A code used in hospital billing to identify specific departments or service locations.',
    },
    dosStart: {
      heading: 'DOS Start',
      description: 'The beginning date for which the service or procedure was performed.',
    },
    dosEnd: {
      heading: 'DOS End',
      description: 'The ending date for the period during which the service was performed.',
    },
    units: {
      heading: 'Units',
      description: 'The total number of units or hours for the specific procedure code on this line.',
    },
    charge: {
      heading: 'Charge',
      description: 'The total dollar amount billed for this specific service line.',
    },
    allowed: {
      heading: 'Allowed',
      description: 'The maximum amount the insurance company covers for this specific service line.',
    },
    paid: {
      heading: 'Paid',
      description: 'The dollar amount actually paid by the insurer for this service line.',
    },
    adjAmt: {
      heading: 'Adj Amt',
      description: 'The difference between the charged amount and the allowed/paid amount.',
    }
  },
  'forecast-trends': {
    teamName: {
      heading: 'Team',
      description: 'The specific group within the organization responsible for the reconciliation records shown in this row.',
    },
    reconCheckPercent: {
      heading: 'Reconciled Check %',
      description: 'The portion of total checks received that have been successfully matched with bank deposits.',
    },
    unreconCheckPercent: {
      heading: 'Unreconciled Check %',
      description: 'The portion of total checks that are still awaiting successful reconciliation with bank deposits.',
    },
    checkCountPercentByTeam: {
      heading: 'Check Count % by Team',
      description: 'The percentage of the organization\'s total check volume handled by this specific team.',
    },
    reconCheckCount: {
      heading: 'Reconciled Check Count',
      description: 'The absolute count of physical or electronic checks that have been fully reconciled.',
    },
    unreconCheckCount: {
      heading: 'Unreconciled Check Count',
      description: 'The absolute count of checks that have not yet been matched to a bank deposit.',
    },
    reconAmountPercent: {
      heading: 'Reconciled Amount %',
      description: 'The percentage of the total dollar amount received that has been successfully reconciled.',
    },
    unreconAmountPercent: {
      heading: 'Unreconciled Amount %',
      description: 'The percentage of the total dollar amount that is still awaiting reconciliation.',
    },
    amountPercentByTeam: {
      heading: 'Amount % by Team',
      description: 'The percentage of the organization\'s total financial volume handled by this team.',
    },
    totalAmountPosted: {
      heading: 'Total Amount Posted',
      description: 'The total cumulative dollar amount that has been verified and recorded in the financial ledger.',
    },
    totalAmountNotPosted: {
      heading: 'Total Amount Not Posted',
      description: 'Funds that have been received but are not yet reflected in the final posting records.',
    },
    avgDaysToReconcile: {
      heading: 'Avg. Days to Reconcile',
      description: 'The average number of days elapsed between payment receipt and final reconciliation completion.',
    }
  },
  'payer-performance': {
    payerName: {
      heading: 'Payer Name',
      description: 'The legal name of the insurance entity or payer being evaluated in this performance scorecard.',
    },
    volume: {
      heading: 'Volume',
      description: 'The total number of unique claims or payment records processed for this payer during the period.',
    },
    depositCount: {
      heading: 'Deposit Count',
      description: 'The count of distinct bank deposit events associated with this payer.',
    },
    matchRate: {
      heading: 'Match Rate',
      description: 'The percentage of transactions from this payer that were automatically matched without requiring manual intervention.',
    },
    denialRate: {
      heading: 'Denial Rate',
      description: 'The percentage of claims submitted to this payer that resulted in a denial of payment.',
    },
    suspenseRate: {
      heading: 'Suspense Rate',
      description: 'The portion of payments from this payer that end up in suspense due to missing data.',
    },
    avgDaysToSettle: {
      heading: 'Avg. Days to Settle',
      description: 'The typical duration from claim submission to final payment settlement for this specific payer.',
    },
    totalVariance: {
      heading: 'Total Variance',
      description: 'The total dollar amount of underpayments or overpayments identified for this payer.',
    },
    description: {
      heading: 'Description',
      description: 'A summary note on the payer\'s overall performance health and specific reconciliation recurring errors.',
    },
    status: {
      heading: 'Payer Status',
      description: 'A status indicating whether the payer\'s reconciliation performance is within acceptable thresholds.',
      statuses: [
        { label: 'Stable', explanation: 'Payer metrics are within target ranges and showing minimal variance.' },
        { label: 'On Watch', explanation: 'Small discrepancies or delays have been noted; monitoring frequency increased.' },
        { label: 'Critical', explanation: 'Significant reconciliation failures or payment delays requiring immediate intervention.' }
      ]
    }
  },
  'payments': {
    effectiveDate: {
      heading: 'Effective Date',
      description: 'The date identifying when the payment was recognized for accounting purposes.',
    },
    type: {
      heading: 'Payment Type',
      description: 'Categorization of the payment (e.g., EFT, Check, Cash).',
    },
    description: {
      heading: 'Description',
      description: 'Detailed context regarding the payment origin or purpose.',
    },
    transactionNo: {
      heading: 'Transaction Number',
      description: 'The reference number assigned to this payment by the bank or insurer.',
    },
    payer: {
      heading: 'Payer',
      description: 'The entity that issued the payment.',
    },
    amount: {
      heading: 'Amount',
      description: 'The total monetary value of the payment.',
    },
    openBalance: {
      heading: 'Open Balance',
      description: 'The portion of the payment that remains unapplied to claims.',
    },
    status: {
      heading: 'Status',
      description: 'Current lifecycle state of the payment record.',
    }
  },
  'reconciliation': {
    depositDate: {
      heading: 'Deposit Date',
      description: 'The date on which the bank deposit or remit record was officially recognized.',
    },
    transactionNo: {
      heading: 'Transaction NO',
      description: 'The unique identification number (e.g., Check # or EFT #) associated with the transaction.',
    },
    payor: {
      heading: 'Payor',
      description: 'The entity responsible for the payment or deposit.',
    },
    bankDeposit: {
      heading: 'Bank Deposit',
      description: 'The total value reported by the bank for this deposit.',
    },
    remittance: {
      heading: 'Remittance',
      description: 'The total value identified in the associated remittance advice documents.',
    },
    variance: {
      heading: 'Variance',
      description: 'The difference between the bank amount and the remit amount.',
    },
    actions: {
      heading: 'Actions',
      description: 'Available administrative tasks for this reconciliation record.',
    },
    description: {
      heading: 'Description',
      description: 'Specific notes explaining the reconciliation status or manual adjustments made.',
    },
    status: {
      heading: 'Status',
      description: 'The current state of the reconciliation record (Reconciled, Unreconciled, or In Queue).',
    }
  },
  'suspense-accounts': {
    account: {
      heading: 'Account Type',
      description: 'The specific category or ledger (e.g., Medicare, Patient, Tax) where unidentified funds currently reside.',
    },
    items: {
      heading: 'Items Count',
      description: 'The total number of individual payments or remittances contributing to the suspense balance.',
    },
    total: {
      heading: 'Total Balance',
      description: 'The cumulative dollar amount currently sitting in this suspense category.',
    },
    payer: {
      heading: 'Facility / Payer',
      description: 'The specific insurance company or provider location associated with the suspense funds.',
    },
    month: {
      heading: 'Reporting Month',
      description: 'The calendar month when the suspense record was first generated or recognized.',
    },
    description: {
      heading: 'Description',
      description: 'Internal documentation detailing the ongoing investigation into these unapplied funds.',
    }
  }
};

export const getDescriptionsForTable = async (tableId: string): Promise<TableDescriptions> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDescriptions[tableId] || {});
    }, 300);
  });
};
