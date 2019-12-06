export default ({ message, subject, fullName, email, headers, storeCode }) => {
  const msg = {
    from: email,
    subject
  };

  const tableElem = (header, content) => {
    return `<tr><th>${header}</th><td>${content}</td></tr>`
  }

  const checkStorecode = (header) => {
    return storeCode && headers[header].hasOwnProperty(storeCode) ? headers[header][storeCode] : headers[header].default
  }

  const table = `
    <table>
      ${tableElem(checkStorecode('email'), email)}
      ${tableElem(checkStorecode('fullName'), fullName)}
      ${tableElem(checkStorecode('subject'), subject)}
      ${tableElem(checkStorecode('message'), message)}
    </table>
  `

  msg.html = table

  return msg
}