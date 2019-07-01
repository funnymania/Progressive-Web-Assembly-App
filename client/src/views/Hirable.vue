<template>
  <div id="hirable-root">
    <h3 class="top-side-title">
      <span>Hirable!</span>
      ->
      <!-- TODO: make this a pop up -->
      <a href @click="popDescription">What is This?</a>
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
    />
    <Chexbox :supportedGroups="this.supportedList"></Chexbox>
    <JobList :listOfJobs="this.jobList"></JobList>
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
      supportedList: [],
      jobList: []
    };
  },
  methods: {
    searchCorns: function(e) {
      let searchedJobs = [];
      // Gather input from search field
      let searchTerm = e.target.value;

      // Gather input from chexboxes
      let desiredCorns = this.supportedList;

      // Package these to fetch /gather
      fetch("gather")
        .then(res => res.json)
        .then(results => (searchedJobs = results))
        .catch(err => console.log(err.message));

      // TODO: trigger spinner saying 'ranging...' while jobList.length == 0
      // on resolve / reject turn off spinner, THEN

      // Persist Chexbox.supportedGroups to localstorage, THEN
      localStorage.setItem("supportedGroups", JSON.stringify(desiredCorns));

      // set listResults backing data to results
      this.jobList = searchedJobs;
    },
    popDescription: function(e) {}
  },
  mounted() {
    fetch("/supported-corns")
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Response not OK.");
        }
      })
      .then(json => json.orgs)
      .then(orgs => {
        let supportedGroups = JSON.parse(
          localStorage.getItem("supportedGroups")
        );
        console.log(supportedGroups);
        // Pull user's last searched for companies into chexbox.
        orgs.forEach(el => {
          if (supportedGroups != null) {
            for (let group of supportedGroups) {
              if (el.name == group.name) {
                el.isSelected = group.isSelected;
                break;
              }
            }
          }
          if (el.isSelected == undefined) {
            el.isSelected = true;
          }
        });
        this.supportedList = orgs;
      })
      .catch(err => console.log(err.message));
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
