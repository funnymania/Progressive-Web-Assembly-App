<template>
  <div id="hirable-root" @click="handleOutsideClicks">
    <h3 class="top-side-title">
      <span>Hirable!</span>
      ->
      <span id="help-top" @click="popUpBoxOnElementClick">What is This?</span>
      ->
      <router-link to="/unicornRanch">Visit Your Ranch</router-link>
    </h3>
    <h1>Are You Hirable?</h1>
    <h1>&#x1F984;</h1>
    <h2>"You look to be a bit hirable..."</h2>
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
    <VerboseTextBox
      :title="this.popUpTitle"
      :display="this.showVerbose"
      :content="this.verboseContent"
    ></VerboseTextBox>
    <!-- <div id="footer">the shinepickaw creative ecosystem @ omon art</div> -->
  </div>
</template>

<script>
import Chexbox from "../components/Chexbox.vue";
import JobList from "../components/JobRes.vue";
import AboutBox from "../components/AboutBox.vue";
import RangingSpinner from "../components/RangingSpinner.vue";
import VerboseTextBox from "../components/VerboseTextBox.vue";

export default {
  name: "Hirable",
  components: {
    Chexbox,
    JobList,
    AboutBox,
    RangingSpinner,
    VerboseTextBox
  },
  data() {
    return {
      activateSpinner: false,
      supportedList: [],
      jobList: [],
      verboseContent: "",
      showVerbose: false,
      popUpTitle: ""
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
      let spinnerResolve = function() {};

      // Trigger spinner saying 'ranging...'
      this.activateSpinner = true;

      // Filter and change property name for API
      let newEntity = [];
      desiredCorns.forEach(el => {
        if (el.isSelected) {
          let { name, ...theRest } = el;
          theRest.orgName = name;
          newEntity.push(theRest);
        }
      });

      // Query with selected orgs
      fetch("gather", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newEntity)
      })
        .then(res => {
          let cornsGathered = res.json();
          return cornsGathered;
        })
        .then(results => {
          searchedJobs = results;

          // Deactivate Spinner
          this.activateSpinner = false;

          // Persist Chexbox.supportedGroups to localstorage
          localStorage.setItem("supportedGroups", JSON.stringify(desiredCorns));

          // Set listResults backing data to results
          this.jobList = searchedJobs;
        })
        .catch(err => {
          this.activateSpinner = false;
          console.log(err.message);
        });
    },
    popUpBoxOnElementClick(e) {
      e.stopPropagation();
      this.verboseContent = `the goal is to get people
      to stop applying for jobs obsessively
      and companies to stop posting
      jobs in the traditional fashion.
      <br><br>by satirizing the pursuit
      as a pokemon trading card game,
      gachapon, or otherwise endless
      quest to Catch 'em ALL!
      <br><br>All cards die fast to reflect
      the hopelessness in returned opportunities
      for recently applied to positions.`;
      this.popUpTitle = "The Answer Is...";
      this.showVerbose = true;
    },
    handleOutsideClicks(e) {
      // Hide all modals showing.
      this.showVerbose = false;
    }
  },
  mounted() {
    let cachedGroups = JSON.parse(localStorage.getItem("supportedGroups"));
    fetch("/supported-corns")
      .then(res => {
        if (res.ok) {
          return res.json();
        }

        throw "Response not OK.";
      })
      .then(json => json.orgs)
      .then(orgs => {
        /**
         * This tags each org with 'isSelected' of
         * corresponding localStorage entry, and if there is no corresponding entry,
         * marks the value as True (aka checks the box).
         * Pull user's last searched for companies into chexbox.
         */
        console.table(orgs);
        orgs.forEach(el => {
          el.name = el.org_name;
          delete el.org_name; // Delete creates sparse memory performance issues at >55000 props
          if (cachedGroups !== null) {
            for (let group of cachedGroups) {
              if (el.name === group.name) {
                el.isSelected = group.isSelected;
                break;
              }
            }
          }

          if (el.isSelected === undefined) {
            el.isSelected = true;
          }
        });

        this.supportedList = orgs;
      })
      .catch(err => console.log(err));
  }
};
</script>

<style lang="scss" scoped>
.top-side-title {
  text-align: left;
  margin-block-start: 0.5em;
}
#help-top {
  font-weight: 600;
  text-align: left;
  // display: block;
  cursor: pointer;
}
#help-top:active,
#help-top:focus {
  text-decoration: underline;
}
#hirable-root {
  color: white;
  height: 100%;
  // overflow: auto;
}
.search-field {
  background: black;
  color: white;
  padding: 0px 0px 8px;
  margin-top: 80px;
  border: none;
  font-size: 23px;
  transition: box-shadow 0.2s ease 0s;
  outline: currentcolor none medium;
  text-align: center;
  &::placeholder {
    opacity: 0;
  }
  &:not(:focus) {
    &::placeholder {
      opacity: 1;
    }
    box-shadow: rgba(0, 251, 251, 0.3) 0px 1px;
  }
}

#footer {
  color: #efefef;
  background-color: black;
  border-radius: 16px;
  padding: 6px;
  font-weight: 600;
  position: relative;
  margin-bottom: 5%;
}
</style>
