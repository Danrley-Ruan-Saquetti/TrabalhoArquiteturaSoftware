import { z } from 'zod'
import { PeopleMessage } from '@application/messages/people.message'
import { PeopleRule } from '@domain/rules/people.rule'
import { PeopleGender } from '@domain/enums/people.enum'

export const peopleUpdateSchema = z.object({
  id: z
    .coerce
    .number({ 'required_error': PeopleMessage.id.required })
    .int(),
  name: z
    .string()
    .trim()
    .min(PeopleRule.name.minCharacters, PeopleMessage.name.rangeCharacters)
    .max(PeopleRule.name.maxCharacters, PeopleMessage.name.rangeCharacters)
    .optional(),
  gender: z
    .nativeEnum(PeopleGender, { errorMap: () => ({ message: PeopleMessage.gender.valueInvalid }) })
    .nullish(),
  dateOfBirth: z
    .coerce
    .date()
    .nullish()
    .refine(
      value => !value || value.getTime() < new Date(Date.now()).getTime(),
      {
        message: PeopleMessage.dateGreaterCurrent.dateGreaterThanCurrent,
        path: ['dateOfBirth']
      },
    ),
})

export type PeopleUpdateDTO = z.input<typeof peopleUpdateSchema>