import { FinancialTransaction as FinancialTransactionPrisma } from '@prisma/client'
import { isTransactionClosed } from '@domain/helpers/financial-transaction.helper'
import { FinancialTransactionFrequency, FinancialTransactionSituation, FinancialTransactionType, FinancialTransactionTypeOccurrence } from '@domain/enums/financial-transaction.enum'
import { IFinancialTransactionSituationState } from '@domain/states/financial-transaction/situation/situation.state'
import { FinancialTransactionSituationStateFabric } from '@domain/states/financial-transaction/situation/fabric'
import { ObjectRequiredProps } from '@shared/types'

export type FinancialTransactionSettings = {
  timesToRepeat: number | null
  countRepeatedOccurrences: number
  typeOccurrence: FinancialTransactionTypeOccurrence
  frequency: FinancialTransactionFrequency | null
}

export interface FinancialTransactionProps extends FinancialTransactionPrisma {
  type: FinancialTransactionType
  situation: FinancialTransactionSituation
  settings: FinancialTransactionSettings
}

export type FinancialTransactionConstructor = ObjectRequiredProps<FinancialTransactionProps, 'bankAccountId' | 'title' | 'type' | 'value' | 'senderRecipient'>

export class FinancialTransaction implements FinancialTransactionProps, IFinancialTransactionSituationState {

  private _id: number
  private _bankAccountId: number
  private _type: FinancialTransactionType
  private _title: string
  private _value: number
  private _description: string
  private _situation: FinancialTransactionSituation
  private _expiresIn: Date | null
  private _senderRecipient: string
  private _dateTimeCompetence: Date
  private _updatedAt: Date
  private _createdAt: Date
  private _settings: FinancialTransactionSettings

  private _situationState: IFinancialTransactionSituationState

  get id() { return this._id }
  get bankAccountId() { return this._bankAccountId }
  get type() { return this._type }
  get title() { return this._title }
  get value() { return this._value }
  get valueInCents() { return this._value * 100 }
  get description() { return this._description }
  get situation() { return this._situation }
  get expiresIn() { return this._expiresIn }
  get senderRecipient() { return this._senderRecipient }
  get dateTimeCompetence() { return this._dateTimeCompetence }
  get updatedAt() { return this._updatedAt }
  get createdAt() { return this._createdAt }
  get settings() { return this._settings }

  set id(value) { this._id = value }
  set type(value) { this._type = value }
  set bankAccountId(value) { this._bankAccountId = value }
  set title(value) { this._title = value }
  set value(value) { this._value = value }
  set description(value) { this._description = value }
  set situation(value) {
    this._situation = value

    this._situationState = FinancialTransactionSituationStateFabric.getState(this)
  }
  set expiresIn(value) { this._expiresIn = value }
  set senderRecipient(value) { this._senderRecipient = value }
  set dateTimeCompetence(value) { this._dateTimeCompetence = value }
  set updatedAt(value) { this._updatedAt = value }
  set createdAt(value) { this._createdAt = value }
  set settings(value) { this._settings = value }

  constructor(props: FinancialTransactionConstructor) {
    this.id = props.id!
    this.bankAccountId = props.bankAccountId
    this.type = props.type
    this.title = props.title
    this.value = props.value
    this.description = props.description || ''
    this.situation = props.situation ?? FinancialTransactionSituation.PENDING
    this.expiresIn = props.expiresIn || null
    this.senderRecipient = props.senderRecipient
    this.dateTimeCompetence = props.dateTimeCompetence! || null
    this.settings = props.settings ?? FinancialTransaction.getDefaultSettings()
    this.createdAt = props.createdAt!
    this.updatedAt = props.updatedAt!

    this._situationState = FinancialTransactionSituationStateFabric.getState(this)
  }

  static getDefaultSettings(): FinancialTransactionSettings {
    return {
      timesToRepeat: null,
      countRepeatedOccurrences: 0,
      typeOccurrence: FinancialTransactionTypeOccurrence.SINGLE,
      frequency: null,
    }
  }

  isClosed() {
    return isTransactionClosed(this.situation)
  }

  isCompleted() {
    return this.situation == FinancialTransactionSituation.COMPLETED
  }

  isCanceled() {
    return this.situation == FinancialTransactionSituation.CANCELED
  }

  toJSON(): FinancialTransactionProps {
    return {
      id: this.id,
      bankAccountId: this.bankAccountId,
      type: this.type,
      title: this.title,
      value: this.value,
      description: this.description,
      situation: this.situation,
      expiresIn: this.expiresIn,
      senderRecipient: this.senderRecipient,
      dateTimeCompetence: this.dateTimeCompetence,
      settings: this.settings,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }

  pending(): void {
    this._situationState.pending()
  }

  conclude(): void {
    this._situationState.conclude()
  }

  late(): void {
    this._situationState.late()
  }

  cancel(): void {
    this._situationState.cancel()
  }
}