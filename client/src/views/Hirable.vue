<template>
  <div id="hirable-root">
    <h3 class="top-side-title">
      <span>Hirable!</span>
      ->
      <!-- TODO: make this a pop up -->
      <a href="" @click="popDescription">What is This?</a>
    </h3>
    <h1>Are You Hirable?</h1>
    <h1>:unicorn:</h1>
    <h2>you look to be a bit hirable..</h2>
    <input
      class="search-field"
      type="text"
      name="title"
      placeholder="Enter desired job title here."
      autocomplete="on"
      @keyup.enter="searchCorns"
    >
    <Chexbox 
      :supportedGroups="this.supportedList"
      @updateChex=updateChex></Chexbox>
    <JobList></JobList>
  </div>
</template>

<script>
import Chexbox from "../components/Chexbox.vue";
import JobList from "../components/JobRes.vue";
import AboutBox from "../components/AboutBox.vue";

export default {
  name: "Hirable",
  components: {
    Chexbox,
    JobList,
    AboutBox
  },
  data() {
    return {
      // TODO: Pick up from axios talking to backend.
      supportedList: []
    };
  },
  methods: {
    updateChex: function(e) {},
    searchCorns: function(e) {
      // Gather input from search field
      let searchTerm = e.target.value;

      // Gather input from chexboxes

      // Package these to fetch /gather
      // trigger spinner saying 'ranging...'
      // on resolve / reject turn off spinner,
      // set listResults backing data to results
      // these listResults being clicked will trigger card collection
    },
    popDescription: function(e) {}
  },
  mounted() {
    // fetch("supported-corns")
    //   .then(res => {
    //     if (res.ok) {
    //       return res.json;
    //     }
    //   })
    //   .then(json => {
    //     this.supportedList = json.orgs
    //     console.log(JSON.stringify(json))
    // });

    // Package isSelected as property with orgs list to intiate reactivity
    // in Chexbox
    let jsonRes = {
      orgs: [
        { name: "google", isSelected: true },
        { name: "amazon", isSelected: true },
        { name: "apple", isSelected: true },
        { name: "twitch", isSelected: true },
        { name: "airbnb", isSelected: true }
      ]
    };
    this.supportedList = jsonRes.orgs;
  }
};

function popDescription() {
  // TODO: draw description box
}
</script>

<style lang="scss" scoped>
.top-side-title {
  text-align: left;
  margin-block-start: 0.5em;
}
#hirable-root {
  color: white;
}
.search-field {
  background: black;
  color: white;
  padding: 0px 0px 8px;
  margin-top: 80px;
  border: none;
  font-size: 28px;
  transition: box-shadow 0.2s ease 0s;
  outline: currentcolor none medium;
  &:not(:focus) {
    box-shadow: rgba(0, 251, 251, 0.3) 0px 1px;
  }
}
</style>
