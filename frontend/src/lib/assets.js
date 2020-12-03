import generic from '@/lib/generic';

export default {
  cache: [],
  imageCache: [],
  async get(path) {
    return this.cache[path] || this.fetch(path);
  },
  async fetch(path) {
    var response = await fetch(path);
    this.cache[path] = await response.text()
    return this.cache[path];
  },
  async getImage(path) {
    if (this.imageCache[path]) return this.imageCache[path];
    this.imageCache[path] = new Image();
    let imgpromise = generic.onload2promise(this.imageCache[path]);
    this.imageCache[path].src = path;
    await imgpromise
    return this.imageCache[path];
  },
}