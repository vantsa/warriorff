<template>
  <div class="main">
    <div class="header">
      <div class="title has-text-centered">Warrior Functional Fitness</div>
    </div>
    <div class="gomb has-text-centered">
      <button class="button is-large is-rounded mb-6 uj" @click="openModal">Új bérlet</button>
    </div>
    <div class="modal" :class="{ 'is-active': showModal }">
      <div class="modal-background" @click="closeModal"></div>
      <div class="modal-card">
        <section class="modal-card-body">
          <form @submit.prevent="addUser">
            <div class="field">
              <label class="label">Név</label>
              <div class="control">
                <input class="input is-rounded" type="text" v-model="formData.name" required>
              </div>
            </div>
            <div class="field">
              <label class="label">Típus</label>
              <div class="control">
                <div class="select is-rounded">
                  <select v-model="formData.selectedOption">
                    <option value="V.I.P. havi bérlet">V.I.P. havi bérlet</option>
                    <option value="Felnőtt havi bérlet">Felnőtt havi bérlet</option>
                    <option value="Gyerek havi bérlet">Gyerek havi bérlet</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="field">
              <label class="label">Érvényesség kezdete</label>
              <div class="control">
                <input class="input is-rounded" type="date" v-model="formData.date" required>
              </div>
            </div>
            <div class="gomb has-text-centered">
              <button class="button is-success" :disabled="!formData.name">Hozzáad</button>
            </div>
          </form>
        </section>
      </div>
    </div>
    <div class="field has-addons mb-5">
      <div class="control">
        <input class="input is-rounded is-medium" type="text" placeholder="Keresés..." v-model="searchQuery">
      </div>
    </div>
    <div v-for='user in filteredUsers' class="card">
      <header class="card-header">
        <p class="card-header-title is-size-4 has-text-centered">{{ user.name }}</p>
      </header>
      <div class="card-content" :class="{ 'red-bg': isExpiring(user.expiringDate) }">
        <div class="content">
          <div class="columns is-mobile is-vcentered">
            <div class="column has-text-left pl-5">
              <p>{{ user.type }}</p>
            </div>
            <div class="column has-text-right pr-5">
              <p>{{ user.expiringDate }}</p>
            </div>
          </div>
        </div>
      </div>
      <footer class="card-footer">
        <div class="card-footer-item is-flex is-justify-content-center">
          <button class="button is-outlined is-info" @click="openEditModal(user.id)">&#9998;</button>
          <button class="button is-outlined is-danger ml-3" @click="openDeleteModal(user.id)">&cross;</button>
        </div>
      </footer>
    </div>
    <!-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!     MODALOKAT A V-FORON KIVUL -->
    <div class="modal" :class="{ 'is-active': editModal }">
            <div class="modal-background" @click="closeEditModal"></div>
            <div class="modal-card">
              <section class="modal-card-body">
                <form @submit.prevent="editUser">
                  <div class="field">
                    <label class="label">Név</label>
                    <div class="control">
                      <input class="input is-rounded" type="text" v-model="editData.name" required>
                    </div>
                  </div>
                  <div class="field">
                    <label class="label">Típus</label>
                    <div class="control">
                      <div class="select is-rounded">
                        <select v-model="editData.selectedOption">
                          <option value='V.I.P. havi bérlet'>V.I.P. havi bérlet</option>
                          <option value='Felnőtt havi bérlet'>Felnőtt havi bérlet</option>
                          <option value='Gyerek havi bérlet'>Gyerek havi bérlet</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div class="field">
                    <label class="label">Érvényesség kezdete</label>
                    <div class="control">
                      <input class="input is-rounded" type="date" v-model="editData.date" required>
                    </div>
                  </div>
                  <div class="valami has-text-centered">
                  <button class="button is-success has-text-centered" @click="updateUser()">Mentés</button>
                  </div>
                </form>
              </section>
            </div>
          </div>
          <div class="modal" :class="{ 'is-active': deleteModal }">
            <div class="modal-background" @click="closeDeleteModal"></div>
            <div class="modal-card has-text-centered">
              <section class="modal-card-body">
                <div class="field">
                  <label class="label mb-5">Biztosan törölni szeretnéd ?</label>
                </div>
                <button class="button is-success mr-5" @click="deleteUser">Igen</button>
                <button class="button is-warning ml-5" @click="closeDeleteModal">Nem</button>
              </section>
            </div>
          </div>
  </div>
</template>

<script>

import { ref, onMounted, computed } from 'vue'
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc} from "firebase/firestore"
import { db } from '@/firebase'

export default {
  setup() {
    const showModal = ref(false);
    const deleteModal = ref(false);
    const editModal = ref(false);
    const userCollectionRef = collection(db, 'users');
    const searchQuery = ref('');
    const formData = ref({
      name: '',
      selectedOption: 'Felnőtt havi bérlet',
      date: new Date().toISOString().split('T')[0],
    });
    const editData = ref({
      name: '',
      selectedOption: '',
      date: '',
      id: '',
    });
    const deleteData = ref({
      id: '',
    })
    const users = ref([]);

    onMounted(() => {
      onSnapshot(userCollectionRef, (querySnapshot) => {
        const fbUsers = []
        querySnapshot.forEach((doc) => {
          const user = {
            id: doc.id,
            name: doc.data().name,
            type: doc.data().type,
            date: doc.data().date,
            expiringDate: doc.data().expiringDate,
          };
          fbUsers.push(user);
        });
        users.value = fbUsers;
      })
    });

    const filteredUsers = computed(() => {
      return users.value.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
    })

    const isExpiring = (expiringDate) => {
      const currentDate = new Date();
      const userExpiringDate = new Date(expiringDate);
      return userExpiringDate < currentDate;
    };

    const openModal = () => {
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
    };

    const openDeleteModal = (userId) => {
      deleteModal.value = true;
      const userToDelete = users.value.find((user) => user.id == userId)
      deleteData.value.id = userToDelete.id;
    };

    const closeDeleteModal = () => {
      deleteModal.value = false;
    };

    const openEditModal = (userId) => {
      editModal.value = true;
      const userToEdit = users.value.find((user) => user.id === userId);
      if (userToEdit) {
        editData.value.name = userToEdit.name;
        editData.value.selectedOption = userToEdit.type;
        editData.value.date = userToEdit.date;
        editData.value.id = userToEdit.id;
      }
      console.log(editData.value);
    };

    const closeEditModal = () => {
      editModal.value = false;
    };

    const addUser = () => {
      const currentDate = new Date(formData.value.date);
      currentDate.setMonth(currentDate.getMonth() + 1);

      addDoc(userCollectionRef, {
        name: formData.value.name,
        type: formData.value.selectedOption,
        date: formData.value.date,
        expiringDate: currentDate.toISOString().split('T')[0],
      });

      formData.value.name = '';
      formData.value.date = new Date().toISOString().split('T')[0];
      closeModal();
    };

    const deleteUser = () => {
      deleteDoc(doc(userCollectionRef, deleteData.value.id));
      closeDeleteModal();
    };

    const updateUser = () => {
      const currentDate = new Date(editData.value.date);
      currentDate.setMonth(currentDate.getMonth() + 1);

      updateDoc(doc(userCollectionRef, editData.value.id), {
        name: editData.value.name,
        type: editData.value.selectedOption,
        date: editData.value.date,
        expiringDate: currentDate.toISOString().split('T')[0]

      });

      closeEditModal();
    };

    return {
      showModal,
      deleteModal,
      editModal,
      formData,
      editData,
      users,
      userCollectionRef,
      searchQuery,
      deleteData,
      filteredUsers,
      isExpiring,
      openModal,
      closeModal,
      openDeleteModal,
      closeDeleteModal,
      openEditModal,
      closeEditModal,
      addUser,
      deleteUser,
      updateUser,
    };
  }
}
</script>

<style>
@import 'bulma/css/bulma.min.css';

@font-face {
  font-family: "Tomorrow-Bold";
  src: local("Tomorrow-Bold"),
    url(assets/fonts/Tomorrow-Bold.ttf) format("truetype");
}

@font-face {
  font-family: "Tomorrow-SemiBold";
  src: local("Tomorrow-SemiBold"),
    url(assets/fonts/Tomorrow-SemiBold.ttf) format("truetype");
}

#app {
  display: block;
  width: 100%;
}

.main {
  width: 90%;
  margin: 0 auto;
}
.red-bg{
  background-color: red;
}
.uj {
  text-transform: uppercase;
  font-family: 'Tomorrow-SemiBold';
  letter-spacing: 3px;
  background-color: #e0e13d;
  color: #231F20;
  width: 40%;
}
.expired-bg{
  background-color: red;
}
p {
  font-size: 20px;
}

.header {
  margin-bottom: 5rem;
}
.card-header-title {
  display: block;
  letter-spacing: 1px;
  font-family: 'Tomorrow-SemiBold';
  padding: 15px;
  color: #e0e13d;
  background-color: #231F20;
}

.title {
  font-family: 'Tomorrow-Bold';
  text-transform: uppercase;
  letter-spacing: 5px;
  font-size: 3.5rem;
  color: white;
  margin-top: 4rem;
}

.control {
  margin: 0 auto;
  width: 40%;
  margin-top: -1rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card {
  width: 50%;
  margin: 0 auto;
  background-color: #e0e13d;
  color: #231F20;
  margin-bottom: 4rem;
}

.card-footer {
  color: #e0e13d;
  background-color: #231F20;
}

.card-footer button {
  margin: 10px;
}

.column {
  font-family: 'Tomorrow-SemiBold';
}

.modal-card-body {
  background-color: #231F20;
}

.label {
  color: #e0e13d;
  font-family: 'Tomorrow-Semibold';
  text-align: center;
  padding-bottom: 15px;
}

.input,
select {
  background-color: #e0e13d;
  color: #231F20;
  font-family: 'Tomorrow-Semibold'
}
.input, .select select, .textarea
{
  background-color: #e0e13d;
  color: #231F20;
  width: 110%;
}
select {
  width: 150%;
}
@media only screen and (max-width:1024px){
  .card{
    width: 70%;
  }
}
@media only screen and (max-width: 895px){
  .header{
    margin-top: -5%;
    margin-bottom: 4rem;
  }
  .card{
    width: 80%;
  }
  .control{
    margin-bottom: 3rem;
  }
}
@media only screen and (max-width: 768px) {
  .uj, .control{
    width: 60%
  }
  .card-header-title{
    font-size: 1.2rem !important;
  }
  p{
    font-size: 1rem !important;
  }
  .card-footer .button{
    font-size: 0.9rem !important;
  }
  .field .control{
    margin-bottom: 1.2rem;
  }
}
@media only screen and (max-width: 650px) {
  p{
    text-align: center;
  }
  .card{
    width: 90%;
  }
}
@media only screen and (max-width: 565px){
  #app{
    padding: 20px !important;
  }
  .title{
    font-size: 2.5rem;
  }
  .header{
    margin-top: -15%;
  }
  .uj, .control{
    width: 90%;
    font-size: 2rem;
  }
  .card-header-title{
    font-size: 1.1rem !important;
  }
  p{
    font-size: 0.9rem !important;
  }
  select{
    width: 100%;
  }
  .input, .select select, .textarea
  {
    width: 100%;
    font-size: 1rem !important; 
  }
  .select:not(.is-multiple):not(.is-loading)::after 
  {
    font-size: 1rem !important;
    margin-top: -1.6rem !important;
  }

}
@media only screen and (max-width: 425px){
  .title{
    font-size: 2rem;
  }
}
</style>