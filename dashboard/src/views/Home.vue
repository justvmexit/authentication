<template>
  <div>
    <h1> Welcome to the MVP project </h1>
    <p id="content">
      An open-source authentication system written in modern JavaScript and C++ 17.
      We focus on maintaining security and we only encrypt actual images with keys derived from license.
      We follow one rule.<br>
      <span>NEVER TRUST THE CLIENT</span>
    </p>
  </div>
</template>

<script>
export default {
  name: 'Home',
}
</script>

<style scoped>
  #content {
    width: 375px;
    margin: auto;
  }

  p {
    word-wrap: break-word;
  }

  p span {
    font-size: 40px;
  }
</style>