# Authentication
A fully fledged authentication system written in modern JavaScript and C++ 17.
Written with the MEVN stack (MySQL, Express.js, Vue.js, Node.js) by a pro leet h4x0r.

# Dashboard
Dashboard / frontend is written in Vue.js 3.0 with Vuex 4.0 in modern JavaScript now it is a little messy but it works fine.

# Backend
Is written in Node.js with Express and MySQL and some other small dependencies but it includes both authentication from client and dashboard data.

# Streaming
Since this is a free small project I only do XOR encryption with a key derived from license but I would recommend either using a huge static key or deriving key from expiry or something.

# Library
Library is written in C++ as a static library so it's easy to include in any project.
Since this is a free project I have not taken the time to make library work for x86.

# Example
I've included an example that authenticates, streams and then decrypts image and it's very simple only for x64 though same as library 😳

# Security Practices
I would never recommend writing anything valuable to disk and if I was to use anything personally as I do in other projects I use [Shellcode Reflective DLL Injection](https://github.com/monoxgas/sRDI) to load it and then I encrypt/decrypt it in runtime with simple XOR.
I would also recommend NEVER TRUSTING CLIENT!! as it is the flaw with a lot of cheat/spoofer loaders as they have no actual security and simply download file or download it unauthenticated and decrypt it with static keys in memory.

# Contact
You can contact me via [twitter](https://twitter.com/messages), [telegram](https://t.me/UniResearcher) or discord `justvmexit#6654`

I am currently looking for a paid-job as I currently just freelance and do internships 👀

# Donate
Since I'm maintaining this for free I'm taking tips 🙏

Bitcoin: `bc1qxsx5fz52g4y2e39m3ntcr5yw7tqa8v55yvz69h`

Ethereum: `0x70408E81A954640039C10b5CB348BD7F90e16660`