let _dropDownService, _clickableDropDownService, _info

const setDropdown = (element) => {
  _dropDownService = element
}

const alert = (type, title, message) => {
  _dropDownService.alertWithType(type, title, message)
}

const permanentAlert = (title) => {
  _dropDownService.alertWithType('warn', title, '', {}, 9999)
}

const closePermanentAlert = () => {
  _dropDownService.close()
}

const setClickableDropdown = (element) => {
  _clickableDropDownService = element
}

const alertWithTap = (type, title, message) => {
  _clickableDropDownService.alertWithType(type, title, message)
}

const DropdownService = {
  alert,
  setDropdown,
  alertWithTap,
  setClickableDropdown,
  permanentAlert,
  closePermanentAlert,
}

export default DropdownService
