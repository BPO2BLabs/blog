function obtenerFechaHoraMySQL () {
  const fechaActual = new Date()

  const año = fechaActual.getFullYear()
  const mes = fechaActual.getMonth() + 1
  const dia = fechaActual.getDate()
  const horas = fechaActual.getHours()
  const minutos = fechaActual.getMinutes()
  const segundos = fechaActual.getSeconds()

  const formatoMes = (mes < 10) ? '0' + mes : mes
  const formatoDia = (dia < 10) ? '0' + dia : dia
  const formatoHoras = (horas < 10) ? '0' + horas : horas
  const formatoMinutos = (minutos < 10) ? '0' + minutos : minutos
  const formatoSegundos = (segundos < 10) ? '0' + segundos : segundos

  const fechaHoraMySQL = año + '-' + formatoMes + '-' + formatoDia + ' ' + formatoHoras + ':' + formatoMinutos + ':' + formatoSegundos

  return fechaHoraMySQL
}

module.exports = {
  obtenerFechaHoraMySQL
}
