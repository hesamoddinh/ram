import MomentJalaali from 'moment-jalaali'
import {IntlProvider} from 'react-intl'
import {translationMessages} from '../i18n'

export const timeToJalaliDate = (t) => {
	if (t < 0) return ''
	const locale = 'fa'
	let messages = translationMessages[locale]
	let {intl} = new IntlProvider({locale: locale, messages: messages}, {}).getChildContext()
	if (t) return MomentJalaali.unix(t / 1000).format(intl.formatMessage({id: 'date.format.shamsi'}))
	else return ''
}