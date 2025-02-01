<template>
  <form autocomplete="on" class="z-0 flex items-center justify-evenly flex-1 p-4 gap-6 md:gap-4 md:flex-row flex-col">
    <div class="card w-full md:w-[22rem] bg-base-100 shadow-xl">
      <figure class="px-5 pt-5">
        <img :src="imagesrc" @error="changeThumb" alt="Invalid Link" class="rounded-xl w-[24rem] h-[27rem]"
          key="imagesrc" />
      </figure>
      <div class="flex flex-col p-5" v-if="true">
        <div class="flex flex-col gap-2">
          <div class="form-control w-full">
            <label class="btn btn-primary" for="file">
              Upload Image
            </label>
            <input type="file" @change="changeImage($event, 'file')" id="file" accept="image/*" style="display: none" />
          </div>
          <div class="flex justify-center">
            <p class="text-center font-bold">OR</p>
          </div>
          <div class="form-control w-full">
            <input id="image" type="text" v-model="imageLinkInput" @input="changeImage($event, 'url')"
              placeholder="paste image link here" class="input input-bordered" />
          </div>
        </div>
      </div>
    </div>

    <div class="card h-full w-full md:w-2/3 flex gap-10 shadow-2xl bg-base-100 justify-between p-8">
      <div class="flex flex-col w-full md:flex-row gap-8 md:gap-20 justify-around">
        <div class="form-control w-full">
          <input type="text" placeholder="Series Name" v-model="seriesData.title" class="input w-full input-bordered"
            required />
        </div>
        <div class="form-control w-full">
          <select class="select  w-full select-primary" v-model="seriesData.series_format" required>
            <option disabled value="">Pick Format</option>
            <option>Trade Paperback</option>
            <option>Hard Cover</option>
            <option>Omnibus</option>
            <option>Absolute Edition</option>
            <option>Manga</option>
          </select>
        </div>
        <div class="form-control w-full">
          <input type="number" v-model.number="seriesData.issue_count" placeholder="Issues Count"
            class="input input-bordered  w-full" />
        </div>
      </div>

      <div class="flex flex-col md:flex-row gap-8 md:gap-20 justify-around">
        <div class="form-control w-full">
          <SingleSelectCombobox v-model="seriesData.publisher" field="publisher" placeholder="Publisher" />
        </div>
        <div class="form-control w-full">
          <MultiSelectCombobox v-model="seriesData.genre" field="genre" placeholder="Genre" />

        </div>
        <div class="form-control w-full">
          <SingleSelectCombobox v-model="seriesData.main_char" field="main_char" placeholder="Main Character/ Team" />

        </div>
      </div>

      <div class="flex flex-col md:flex-row gap-20 justify-around">
        <div class="form-control w-1/3 mr-16">
          <MultiSelectCombobox v-model="seriesData.creator" field="creator" placeholder="Creator" />

        </div>
        <div class="form-control w-2/3">
          <textarea class="textarea textarea-bordered" placeholder="Summary"
            v-model="seriesData.description"></textarea>
        </div>
      </div>

      <div class="flex flex-col md:flex-row gap-16  justify-around">
        <div class="form-control w-full">
          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="text-emerald-400">All Bought?</span>
              <input type="checkbox" true-value="1" false-value="0" v-model.number="seriesData.owned_count"
                class="checkbox checkbox-accent" />
            </label>
          </div>
        </div>
        <div class="form-control w-full">
          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="text-emerald-400">Read Already?</span>
              <input type="checkbox" true-value="1" false-value="0" v-model.number="seriesData.read_count"
                class="checkbox checkbox-accent" />
            </label>
          </div>
        </div>
      </div>
      <div class="flex flex-col md:flex-row gap-16 justify-around">
        <div class="form-control w-full">
          <button type="button" @click="modalRef = true" class="btn btn-primary">
            Add Series
          </button>
        </div>
        <div class="form-control w-full">
          <button type="button" @click="router.push('collection')" class="btn btn-danger">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </form>
  <AddIssueDetailsModal v-model:modalRef="modalRef" />
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

import type { Series } from "@/types/series.types";

import IssueService from "../services/IssueService";
import SeriesService from "../services/SeriesService";
import SingleSelectCombobox from "../components/customInputs/SingleSelectCombobox.vue";
import MultiSelectCombobox from "../components/customInputs/MultiSelectCombobox.vue";
import AddIssueDetailsModal from '../components/modals/AddIssueDetailsModal.vue'

const imagesrc = ref(new URL("../assets/dummy.webp", import.meta.url).href);

const modalRef = ref(false);

const router = useRouter();
const imageLinkInput = ref("");

const seriesData: Partial<Series> = reactive({
  title: "",
  creator: [],
  description: "",
  genre: [],
  main_char: "",
  series_format: "",
  issue_count: "",
  thumbnail: "",
  publisher: "",
  read_count: 0,
  owned_count: 0,
});



function changeImage(event: any, inputType: string) {

  const file = event.target.files && event.target.files[0]
    ? URL.createObjectURL(event.target.files[0])
    : "";

  let newValue: string = "";
  if (inputType === "file") {
    newValue = file;
    imageLinkInput.value = event.target.value
  } else if (inputType === "url") {
    newValue = event.target.value || new URL("../assets/dummy.webp", import.meta.url).href;
  }

  imagesrc.value = newValue;
  console.log(imagesrc.value);
  seriesData.thumbnail = event.target.files ? event.target.files[0] : "noimage";
}

function changeThumb() {
  seriesData.thumbnail = "noimage";
}

async function createSeries() {

  if (!seriesData.title.trim()) {
    console.log("Title is required!");
    return;
  }

  try {
    const owned_count = seriesData.owned_count == 1 ? seriesData.issue_count : 0;
    const read_count = seriesData.read_count == 1 ? seriesData.issue_count : 0;

    // Create a FormData object
    const formData = new FormData();
    formData.append("title", seriesData.title);
    formData.append("publisher", seriesData.publisher || "");
    formData.append("creator", JSON.stringify(seriesData.creator || []));
    formData.append("description", seriesData.description || "");
    formData.append("genre", JSON.stringify(seriesData.genre || []));
    formData.append("main_char", seriesData.main_char || "");
    formData.append("main_char_type", "character");
    formData.append("series_format", seriesData.series_format || "");
    formData.append("issue_count", seriesData.issue_count?.toString() || "0");
    formData.append("read_count", read_count.toString());
    formData.append("owned_count", owned_count.toString());

    // Append the image file if it exists
    if (seriesData.thumbnail && typeof seriesData.thumbnail !== "string") {
      formData.append("thumbnail", seriesData.thumbnail);
    }

    // Send the FormData to the backend
    const response = await SeriesService.addSeries(formData);

    if (seriesData.issue_count > 0) {
      addIssues();
    } else {
      console.log("nothing to add");
    }
  } catch (error) {
    console.log(error);
  }
}

async function getPrimaryKey() {
  try {
    const response = await SeriesService.getSeriesKey();

    const key = response.data;

    return key;
  } catch (error) {
    console.log(error);
  }
}

async function addIssues() {
  var key = await getPrimaryKey();
  try {
    const response = await IssueService.addIssues(
      key,
      {
        title: "title",
        is_read: 1,
        is_owned: 1,
      },
    );
  } catch (error) {
    console.log(error);
  }
}



</script>

<style scoped>
img {
  color: red;
  font-size: x-large;
  text-align: center;
}
</style>
