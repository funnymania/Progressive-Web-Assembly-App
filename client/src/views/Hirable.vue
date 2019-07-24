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
    <h2>you look to be a bit hirable.. :)</h2>
    <input
      class="search-field"
      type="text"
      name="title"
      placeholder="Enter desired job title here."
      autocomplete="on"
      @keyup.enter="searchCorns"
    />
    <RangingSpinner :activate="this.activateSpinner"></RangingSpinner>
    <Chexbox :supportedGroups="this.supportedList"></Chexbox>
    <JobList :listOfJobs="this.jobList"></JobList>
  </div>
</template>

<script>
import Chexbox from "../components/Chexbox.vue";
import JobList from "../components/JobRes.vue";
import AboutBox from "../components/AboutBox.vue";
import RangingSpinner from "../components/RangingSpinner.vue";

export default {
  name: "Hirable",
  components: {
    Chexbox,
    JobList,
    AboutBox,
    RangingSpinner
  },
  data() {
    return {
      activateSpinner: false,
      supportedList: [],
      jobList: []
    };
  },
  methods: {
    searchCorns(e) {
      let searchedJobs = [];

      // Gather input from search field
      let searchTerm = e.target.value;

      // Gather input from chexboxes
      let desiredCorns = this.supportedList;

      // Set spinner resolve, run when results have been generated.
      let spinnerResolve = function() {
        console.log("Spinner done");

        // Persist Chexbox.supportedGroups to localstorage
        localStorage.setItem("supportedGroups", JSON.stringify(desiredCorns));
      };

      // Trigger spinner saying 'ranging...'
      let spinnerPromise = new Promise((spinnerResolve, reject) => {
        // Activate spinner
        this.activateSpinner = true;
      }).then(() => {
        this.activateSpinner = false;
      });

      // Package these to fetch /gather
      fetch("gather", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(desiredCorns)
      })
        .then(res => {
          let cornsGathered = res.json();
          console.log(cornsGathered);
          return cornsGathered;
        })
        .then(results => {
          searchedJobs = results;
          spinnerResolve();

          // Set listResults backing data to results
          this.jobList = searchedJobs;
        })
        .catch(err => console.log(err.message));
    },
    popDescription(e) {}
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
  height: 100%;
  overflow: auto;
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
