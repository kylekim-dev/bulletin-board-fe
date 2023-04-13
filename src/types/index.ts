export interface ICredential {
  email: string;
  password: string;
}
export interface LoginFormValues {
  username: string;
  password: string;
}

export interface IMenu {
  name: string;
  path: string;
  open: boolean;
  icon: string;
  subMenuList?: IMenu[] | null;
}

export interface UserProfile {
  userId: number;
  userOrgProfileId: number;
  organizationId: number;
  securityProfileId: number;
  role: number;
  userName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  securityProfileName: string;
  organizationType: string;
  organizationName: string;
  organizationCode: string;
  fullName: string;
  userInitial: string;
  securityProfileInitial: string;
  originationChannel: number;
  originationChannelName: string;
  token: string;
  accessToken: string;
  tokenExpirationDate: Date | null;
  startDate: Date | null;
  terminationDate: Date | null;
}

export interface MstCode {
  codeId: string;
  codeGroup: string;
  codeType: string;
  codeValue: string;
  codeName: string;
  displayName: string;
  codeIndex: number | null;
  reference1: string | null;
  reference2: string | null;
  reference3: string | null;
  reference4: string | null;
  reference5: string | null;
  reference6: string | null;
  reference7: string | null;
  reference8: string | null;
  reference9: string | null;
  reference10: string | null;
  reference11: string | null;
  reference12: string | null;
  reference13: string | null;
  reference14: string | null;
  reference15: string | null;
  reference16: string | null;
  reference17: string | null;
  reference18: string | null;
  reference19: string | null;
  reference20: string | null;
  excluded: string;
}

export interface SelectItem {
    label: string;
    value: any | null;
    enabled: boolean;
}

export interface StatusWindow {
  isOpen: boolean;
  status: 'success' | 'info' | 'warning' | 'error' | undefined;
  title?: string | null;
  message?: string | null;
} 


export interface FileData {
  fileName: string | null;
  organizationId: number;
  occupancyType: number;
  documentationType: number;
  fileCreditScore: number | null;
  fileCreditScoreMask: string | null;
  loan: Loan;
  subProp: SubProp;
  waiveEscrow: number;
  loCompType: number;
  compPlanId: number;
  pricingOptions: PricingOption[] | null; 
  customFields: CustomFields | null;
}

export interface Loan {
  loanProgramId: number;
  dti: number | null;
  dtiMask: string | null;
  mortgageType: number;
  loanPurpose: number;
  refiPurpAu: number;
  purPrice: number | null;
  purPriceMask: string | null;
  baseLoan: number | null;
  baseLoanMask: string | null;
  ltv: number | null;
  ltvMask: string | null;
  cltv: number | null;
  cltvMask: string | null;
  loanProductType: number;
  lockDays: number;
  term: number | null;
}

export interface SubProp {
  appraisedValue: number | null;
  appraisedValueMask: string | null;
  propertyType: number;
  noUnits: number;
  state: string | null;
  county: string | null;
}

export interface User {
  userId: number;
  userOrgProfileId: number;
  organizationId: number;
  securityProfileId: number;
  role: number;
  userName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  securityProfileName: string;
  organizationType: string;
  organizationName: string;
  organizationCode: string;
  fullName: string;
  userInitial: string;
  securityProfileInitial: string;
  originationChannel: number;
  originationChannelName: string;
  token: string;
  accessToken: string;
  tokenExpirationDate: Date | null;
  startDate: Date | null;
  terminationDate: Date | null;
}

export interface LoanEligibility {
  loanProgramName: string | null;
  loanProgramCode: string | null;
  loanProgramID: number;
  eligibility: boolean;
  ineligibleNote: string | null;
  intRate: number | null;
  price: number | null;
  note: string | null;
}

export interface PricingOption {
  codeType: string | null;
  defaultValue: string | null;
  displayName: string | null;
  fieldType: string | null;
  lookupList: MstCode[] | null;
  optionNote: string | null;
  pricerFieldName: string;
  required: boolean;
  errorMessage: string | null;
}

export interface AdjustmentItem {
  note: string | null;
  adjustmentTemplateID: number;
  priceAdjustment: number;
  rateAdjustment: number;
  marginAdjustment: number;
  isApplyMaxPrice: boolean;
  isApplyMaxAdjustment: boolean;
  showOnWebsite: boolean;
  excluded: string | null;
}

export interface Ratesheet {
  selected: boolean;
  selectable: boolean;
  unselectReason: string | null;
  baseRate: number | null;
  basePrice: number | null;
  finalRate: number | null;
  finalPrice: number | null;
  priceAdjustment: number | null;
  rateAdjustment: number | null;
  maxPriceAdjustment: number | null;
  monthlyPayment: number | null;
}

export interface CompPlanModel {
  id: number;
  compPlanID: number | null;
  compPlanType: number | null;
  compPlanCode: string | null;
  startDate: string;
  endDate: string;
  notes: string | null;
  dollarAmount: number;
  percentage: number;
  minAmount: number;
  maxAmount: number;
  totalPercentage: number;
}

export interface CustomFields {
  field04: string | null;
}

export interface PricingToken {
  pricingDateTime: string | null;
  tokenData: string | null;
}

export interface PricingResult {
  adjustments: AdjustmentItem[];
  ratesheets: Ratesheet[];
  compensation: CompPlanModel[];
  token: PricingToken;
  disclaimers: string[] | null;
}

export interface CIConditionItem {
  itemId: number;
  itemName: string | null;
  itemType: string | null;
  codeGroup: string | null;
  codeType: string | null;
  pricerFieldName: string | null;
  excluded: string;
}

export interface AmortizationTable {
  paymentNumber: number;
  paymentDate: Date;
  balance: number;
  principalPayment: number;
  interestPayment: number;
  totalPayment: number;
}