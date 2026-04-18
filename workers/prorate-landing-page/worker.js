export default {
  async fetch(request) {
    const response = await fetch('https://iroiro.us/pages/prorate.html')
    return response
  }
}
