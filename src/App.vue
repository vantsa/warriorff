<template>
  <div class="main">
    <div class="header">
      <div class="title has-text-centered">Vántsa BET</div>
      <div class="stats">
        <div class="stat">Profit<br><span :class="{ 'green-text': total > 0, 'red-text': total <= 0 }">{{ total.toFixed(2)
            }}</span> RON</div>
        <div class="stat">Avg. odds<br><span>{{ avgOdds.toFixed(2) }} </span></div>
        <div class="stat">Avg. bet<br><span>{{ avgAmount.toFixed(2) }} </span>RON</div>
        <div class="stat">Win<br><span>{{ (winRate * 100).toFixed(2) }} </span>%</div>
      </div>

    </div>
    <div class="gomb has-text-centered">
      <button class="button is-large is-rounded mb-6 uj" @click="openModal">Add bet</button>
    </div>
    <div class="modal" :class="{ 'is-active': showModal }">
      <div class="modal-background" @click="closeModal"></div>
      <div class="modal-card">
        <section class="modal-card-body">
          <form @submit.prevent="addUser">
            <div class="field">
              <label class="label">Sport</label>
              <div class="control">
                <div class="select is-rounded">
                  <select v-model="formData.selectedOption">
                    <option value="Soccer">Soccer</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Ice hockey">Ice hockey</option>
                    <option value="Tennis">Tennis</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="field">
              <label class="label">Matchup</label>
              <div class="control">
                <input class="input is-rounded" type="text" v-model="formData.name" required>
              </div>
            </div>
            <div class="field">
              <label class="label">Your bet:</label>
              <div class="control">
                <input class="input is-rounded" type="text" v-model="formData.choice" required>
              </div>
            </div>
            <div class="field">
              <label class="label">Odds:</label>
              <div class="control">
                <input class="input is-rounded" type="number" step=".01" v-model="formData.odds" required>
              </div>
            </div>
            <div class="field">
              <label class="label">Amount:</label>
              <div class="control">
                <input class="input is-rounded" type="number" step=".01" v-model="formData.amount" required>
              </div>
            </div>
            <div class="field">
              <label class="label">Date</label>
              <div class="control">
                <input class="input is-rounded" type="date" v-model="formData.date" required>
              </div>
            </div>
            <div class="field">
              <label class="label">Is winner</label>
              <div class="control">
                <div class="select is-rounded">
                  <select v-model="formData.isWinner">
                    <option value="WIN">Yes</option>
                    <option value="NO">No</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="gomb has-text-centered">
              <button class="button is-success" :disabled="!formData.name">Add</button>
            </div>
          </form>
        </section>
      </div>
    </div>
    <div class="field has-addons mb-5">
      <div class="control">
        <input class="input is-rounded is-medium" type="text" placeholder="Search..." v-model="searchQuery">
      </div>
    </div>
    <p class="totalBetNumber"><br>Total number of bets: <b>{{ nrOfBets }}</b></p>
    <div v-for='user in filteredUsers' class="card">
      <header class="card-header">
        <p class="card-header-title is-size-4 has-text-centered">{{ user.name }}</p>
      </header>
      <div class="card-content">
        <div class="content">
          <div class="columns is-mobile is-vcentered" style="margin-left: 1rem">
            <div class="column" style="text-align: center">
              <p><span>Tip:</span>{{ user.choice }}</p>
            </div>
            <div class="column" style="text-align: left">
              <p><span>Odds:</span>{{ user.odds }}</p>
            </div>
          </div>
          <div class="columns is-mobile is-vcentered" style="margin-left: 0.5rem">
            <div class="column" style="text-align: center">
              <p><span>Cost:</span>{{ user.amount }} <span>RON</span></p>
            </div>
            <div class="column"  style="margin-left: -2rem;">
              <p><span>Prize:</span>{{ user.amount * user.odds }} <span>RON</span></p>
            </div>
          </div>
        </div>
      </div>
      <footer class="card-footer">
        <div class="card-footer-item is-flex is-justify-content-space-between">
          <p class="isWinner" :style="{ color: user.isWinner === 'WIN' ? 'green' : 'red' }">
            {{ user.isWinner === 'WIN' ? 'WON' : 'LOST' }}
          </p>
          <div class="box2">
            <button class="button is-outlined is-info" @click="openEditModal(user.id)">&#9998;</button>
            <button class="button is-outlined is-danger ml-3" style="margin-right: 3rem"
              @click="openDeleteModal(user.id)">&cross;</button>
          </div>
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
              <label class="label">Matchup</label>
              <div class="control">
                <input class="input is-rounded" type="text" v-model="editData.name" required>
              </div>
            </div>
            <!-- Ensure the edit modal uses the same fields as the v-for loop -->
            <div class="field">
              <label class="label">Sport</label>
              <div class="control">
                <div class="select is-rounded">
                  <select v-model="editData.selectedOption">
                    <option selected value="Soccer">Soccer</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Ice hockey">Ice hockey</option>
                    <option value="Tennis">Tennis</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="field">
              <label class="label">Tip</label>
              <div class="control">
                <input class="input is-rounded" type="text" v-model="editData.choice" required>
              </div>
            </div>
            <div class="field">
              <label class="label">Odds</label>
              <div class="control">
                <input class="input is-rounded" type="number" step=".01" v-model="editData.odds" required>
              </div>
            </div>
            <div class="field">
              <label class="label">Amount</label>
              <div class="control">
                <input class="input is-rounded" type="number" step=".01" v-model="editData.amount" required>
              </div>
            </div>
            <div class="field">
              <label class="label">Date</label>
              <div class="control">
                <input class="input is-rounded" type="date" v-model="editData.date" required>
              </div>
            </div>
            <div class="field">
              <label class="label">Is winner</label>
              <div class="control">
                <div class="select is-rounded">
                  <select v-model="editData.isWinner">
                    <option value="WIN">Yes</option>
                    <option value="NO">No</option>
                  </select>
                </div>
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
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { db } from '@/firebase'

export default {
  setup() {
    const showModal = ref(false);
    const deleteModal = ref(false);
    const editModal = ref(false);
    const userCollectionRef = collection(db, 'users');
    const searchQuery = ref('');
    const formData = ref({
      selectedOption: 'Ice hockey',
      name: '',
      choice: '', // Changed 'choise' to 'choice'
      odds: 0,
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      isWinner: 'NO'
    });
    const editData = ref({
      selectedOption: '', // Changed 'selectedOption' to empty string
      name: '',
      choice: '', // Changed 'choise' to 'choice'
      amount: 0,
      odds: 0,
      date: '', // Changed 'date' to empty string
      isWinner: ''
    });
    const deleteData = ref({
      id: '',
    })
    const users = ref([]);

    const avgOdds = ref(0);
    const avgAmount = ref(0);
    const total = ref(0);
    const nrOfBets = ref(0);
    const winRate = ref(0);

    onMounted(() => {
      onSnapshot(userCollectionRef, (querySnapshot) => {
        const fbUsers = [];
        let oddsSum = 0;
        let amountSum = 0;
        total.value = 0;
        nrOfBets.value = 0;

        querySnapshot.forEach((doc) => {
          const user = {
            id: doc.id,
            name: doc.data().name,
            choice: doc.data().choice,
            odds: doc.data().odds,
            amount: doc.data().amount,
            date: doc.data().date,
            isWinner: doc.data().isWinner,
            selectedOption: doc.data().selectedOption,
          };
          let ifWinner = ((user.amount * user.odds) - user.amount);
          total.value += user.isWinner === 'WIN' ? ifWinner : (-user.amount);
          oddsSum += user.odds;
          amountSum += user.amount;

          fbUsers.push(user);
        });
        users.value = fbUsers;

        nrOfBets.value = users.value.length;
        avgOdds.value = oddsSum / fbUsers.length;
        avgAmount.value = amountSum / fbUsers.length;
        CalculateWinRatio();
      })
    });

    const CalculateWinRatio = () => {
      if (nrOfBets.value === 0) {
        winRate.value = 0;
      } else {
        const numberOfWins = users.value.filter(user => user.isWinner === 'WIN').length;
        winRate.value = numberOfWins / nrOfBets.value;
      }
    };

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
        editData.value.selectedOption = userToEdit.selectedOption;
        editData.value.choice = userToEdit.choice; // Changed 'choise' to 'choice'
        editData.value.odds = userToEdit.odds;
        editData.value.amount = userToEdit.amount;
        editData.value.date = userToEdit.date;
        editData.value.isWinner = userToEdit.isWinner;
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
        choice: formData.value.choice, // Changed 'choise' to 'choice'
        odds: formData.value.odds,
        amount: formData.value.amount,
        date: formData.value.date,
        expiringDate: currentDate.toISOString().split('T')[0],
        isWinner: formData.value.isWinner
      });

      formData.value.name = '';
      formData.value.choice = ''; // Changed 'choise' to 'choice'
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
        choice: editData.value.choice, // Changed 'choise' to 'choice'
        odds: editData.value.odds,
        amount: editData.value.amount,
        date: editData.value.date,
        expiringDate: currentDate.toISOString().split('T')[0],
        isWinner: editData.value.isWinner
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
      avgOdds,
      avgAmount,
      total,
      nrOfBets,
      winRate,
      CalculateWinRatio,
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
  background-color: #181818 !important;
}

body {
  background-color: #181818 !important;
}

.main {
  width: 90%;
  margin: 0 auto;
}

.red-bg {
  background-color: red;
}

.green-text {
  color: green;
}

.red-text {
  color: red;
}

.uj {
  text-transform: uppercase;
  font-family: 'Tomorrow-SemiBold';
  letter-spacing: 3px;
  background-color: #181818;
  color: #E9EBED;
  width: 40%;
  border: 2px solid #00FFFF;
  box-shadow: 0 0 15px 5px rgba(0, 255, 255, 0.8);
}

select {
  border: 2px solid #00FFFF;
  box-shadow: 0 0 15px 5px rgba(0, 255, 255, 0.8);
}

p span {
  font-size: 17px;
  margin-right: 10px;
  font-weight: normal;
}

.expired-bg {
  background-color: red;
}

p {
  font-size: 24px;
}

.gomb {
  margin-bottom: 2rem;
}

.header {
  margin-bottom: 5rem;
}

.card-header-title {
  display: block;
  letter-spacing: 1px;
  font-family: 'Tomorrow-SemiBold';
  padding: 15px;
  color: #E9EBED;
  background-color: #181818;
}

.title {
  font-family: 'Tomorrow-Bold';
  text-transform: uppercase;
  letter-spacing: 5px;
  font-size: 3.5rem;
  color: #E9EBED;
  margin-top: 4rem;
}

.isWinner {
  font-weight: bold;
  font-size: 30px;
  margin-left: 3rem;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  grid-gap: 10px;
}

.stat {
  text-align: center;
  padding: 10px;
}

.stats .stat {
  color: white;
  font-size: 18px;
}

.stats span {
  font-weight: bold;
  font-size: 24px;
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

.content span {
  font-size: 14px;
}

.card {
  width: 65%;
  margin: 0 auto;
  background-color: #ea060a;
  color: #E9EBED;
  background-color: #181818;
  border: 5px solid #00FFFF;
  box-shadow: 0 0 15px 5px rgba(0, 255, 255, 0.8);
  border-radius: 5px;
  margin-bottom: 4rem;
}

.card-footer {
  color: #ea060a;
  background-color: #181818;
  width: 100%;
  border-top: 1px solid #00FFFF;
  box-shadow: 0px 0px 15 px 5px rgba(0, 255, 255, 0.8);

}

.card-footer-item {
  width: 80%;
}

.card-footer button {
  margin: 10px;
}

.column {
  font-family: 'Tomorrow-SemiBold';
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  margin-top: -1rem;
}
.column p {
  font-size: 14px;
}
.column span{
  font-size: 12px;
}

.modal-card-body {
  background-color: #181818;
}

.label {
  font-family: 'Tomorrow-Semibold';
  text-align: center;
  padding-bottom: 15px;
  color: #E9EBED;
}

.input,
select {
  border: 2px solid #00FFFF;
  box-shadow: 0 0 15px 5px rgba(0, 255, 255, 0.8);
  color: #E9EBED;
  font-family: 'Tomorrow-Semibold'
}

.input::placeholder {
  color: #E9EBED;
}

.input,
.select select,
.textarea {
  background-color: #181818;
  color: #E9EBED;
  width: 110%;
  border: 2px solid #00FFFF;
  box-shadow: 0 0 15px 5px rgba(0, 255, 255, 0.8);
}

select {
  width: 150%;
}

.totalBetNumber {
  color: white;
  margin-top: -3rem;
  margin-bottom: 2rem;
  font-weight: lighter;
}

@media only screen and (max-width:1024px) {
  .card {
    width: 80%;
  }
}

@media only screen and (max-width: 895px) {
  .header {
    margin-top: -5%;
    margin-bottom: 4rem;
  }

  .card {
    width: 90%;
  }

  .control {
    margin-bottom: 3rem;
  }
}

@media only screen and (max-width: 768px) {

  .uj,
  .control {
    width: 60%
  }

  .card-header-title {
    font-size: 1.2rem !important;
  }

  p {
    font-size: 1rem !important;
  }

  .card-footer .button {
    font-size: 0.9rem !important;
  }

  .field .control {
    margin-bottom: 1.2rem;
  }
}

@media only screen and (max-width: 650px) {
  p {
    text-align: center;
  }

  .card {
    width: 95%;
  }
}

@media only screen and (max-width: 565px) {
  #app {
    padding: 20px !important;
  }

  .title {
    font-size: 2.5rem;
  }

  .header {
    margin-top: -15%;
  }

  .uj,
  .control {
    width: 90%;
    font-size: 2rem;
  }

  .card-header-title {
    font-size: 1.1rem !important;
  }

  p {
    font-size: 0.9rem !important;
  }

  select {
    width: 100%;
  }

  .input,
  .select select,
  .textarea {
    width: 100%;
    font-size: 1rem !important;
  }

  .select:not(.is-multiple):not(.is-loading)::after {
    font-size: 1rem !important;
    margin-top: -1.6rem !important;
  }

}

@media only screen and (max-width: 425px) {
  .title {
    font-size: 2rem;
  }
}
</style>