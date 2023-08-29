<!-- Author: Jan-Christopher Möhn -->
<!-------- HTML -------->
<template>
    <b-navbar toggleable="lg" type="dark" variant="">
        <b-navbar-brand class="m-3" href="/">
          <img src="@/assets/Logo.webp" width="39" height="50" alt="" style="vertical-align: middle;">
          <span class="m-3" style="font-size:25px; vertical-align: middle;">Be a firefighter</span>
        </b-navbar-brand>
        <!-- Navbar-Elements -->
        <b-navbar-toggle target="nav-collapse" class="m-3"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav class="justify-content-end">
          <b-navbar-nav>
            <b-nav-item class="m-3 text-end" href="/" style="font-size:20px">Home</b-nav-item>
            <b-nav-item class="m-3 text-end" href="/cars" style="font-size:20px">Fahrzeuge</b-nav-item>
            <b-nav-item class="m-3 text-end" href="/quizs" style="font-size:20px">Quiz</b-nav-item>
            <b-nav-item class="m-3 text-end" href="/editor" style="font-size:20px">Editor</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>