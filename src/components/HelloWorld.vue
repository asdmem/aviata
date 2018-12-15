<template>
  <section>
    <div class="filters">
      <div class="dropdown">
        <div class="dropdown-title">
          <span class="dropdown-title-name">Авиакомпании</span>
          <span class="dropdown-symbol"></span>
        </div>
        <div class="dropdown-list">
          <div class="dropdown-item">
            <label class="custom-checkbox">
              <input v-model="allCompanies" @change="allSelected" type="checkbox">
              <div class="custom-checkbox-content"></div>
            </label>
            <span>Все</span>
          </div>
          <div class="dropdown-item" v-for="name of companies">
            <label class="custom-checkbox">
              <input
                type="checkbox"
                v-model="selectedCompanies"
                :value="name"
                @change="applyFilters"
              >
              <div class="custom-checkbox-content"></div>
            </label>
            <span>{{name}}</span>
          </div>
        </div>
      </div>
      <div class="direct-fly">
        <label class="custom-checkbox">
          <input v-model="onlyDirect" @change="applyFilters" type="checkbox">
          <div class="custom-checkbox-content"></div>
        </label>
        <span>Только прямые рейсы</span>
      </div>
    </div>
    <div class="sell-block">
      <div class="header">
        <div class="name column">Авиакомпания</div>
        <div class="type column">Рейс</div>
        <div class="misc column">Выбор времени</div>
        <div class="d-a-time column">Вылет-посадка</div>
        <div class="travel-time column">Время в пути</div>
        <div class="buy-button column"></div>
      </div>
      <div class="tickets">
        <div class="ticket" v-for="ticket of filteredTickets">
          <div class="name column">
            <img v-for="flight of ticket.flights" :src="getImageByCompanyName(flight.airline.name)">
          </div>
          <div class="type column">{{ticket.flights.length > 1 ? 'Пересадка' : 'Прямой'}}</div>
          <div class="misc column">
            <div class="time-select">
              <span class="text">Выбрать другое время</span>
              <span class="dropdown-symbol"></span>
            </div>
            <span class="share text">Поделиться</span>
          </div>
          <div class="d-a-time column">
            <span v-for="flight of ticket.flights">{{flight.departureTime}} - {{flight.arrivalTime}}</span>
          </div>
          <div class="travel-time column">
            <span>{{ticket.flightDuration | formatTravelTime}}</span>
          </div>
          <div class="buy-button column">
            <button>Купить за {{ticket.price | formatCurrency}} KZT</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import { Ticket } from "../interfaces/ticket.interface";
import { Filter } from "../interfaces/filter.interface";
@Component
export default class HelloWorld extends Vue {
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  imgPath = new Map<string, string>();
  companies: string[] = [];

  onlyDirect = false;
  selectedCompanies: string[] = [];
  allCompanies = true;
  constructor() {
    super();
    this.imgPath.set("Air Astana", "/img/air_astana.png");
    this.imgPath.set("Scat", "/img/scat.png");
  }
  async created() {
    this.tickets = await fetch("/data.json").then(res => res.json());
    this.filteredTickets = this.tickets;
    const uniqueNames = new Set<string>();
    this.tickets.forEach(t =>
      t.flights.forEach(f => uniqueNames.add(f.airline.name))
    );
    this.companies = Array.from(uniqueNames);
    this.selectedCompanies = this.companies;
  }

  getImageByCompanyName(name: string) {
    return this.imgPath.get(name);
  }

  allSelected() {
    this.selectedCompanies = this.allCompanies ? this.companies : [];
    this.applyFilters();
  }

  onlyDirectFilter(filter: Filter<Ticket>) {
    if (this.onlyDirect) {
      filter.data = filter.data.filter(t => t.flights.length === 1);
    }
  }

  companySelectFilter(filter: Filter<Ticket>) {
    if (this.selectedCompanies.length > 0) {
      filter.data = filter.data.filter(t =>
        t.flights.some(f => this.selectedCompanies.includes(f.airline.name))
      );
      this.allCompanies =
        this.selectedCompanies.length === this.companies.length;
    }
  }

  applyFilters() {
    const filter: Filter<Ticket> = {
      data: this.tickets
    };
    this.onlyDirectFilter(filter);
    this.companySelectFilter(filter);
    this.filteredTickets = filter.data;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$color: #212c5b;
.custom-checkbox {
  display: inline-flex;
  width: 17px;
  height: 17px;
  position: relative;
  input {
    display: none;
  }
  input:checked + .custom-checkbox-content {
    background-color: #fe9922;
    &::before {
      content: "\2713";
    }
  }
  .custom-checkbox-content {
    border: 1px solid black;
    border-radius: 2px;
    position: absolute;
    width: 100%;
    height: 100%;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
  }
}
.dropdown-symbol {
  border-right: 1px solid $color;
  border-bottom: 1px solid $color;
  transform: rotate(45deg);
}
section {
  width: 1000px;
  display: flex;
  flex-direction: column;
  font-size: 0.85em;

  .filters {
    color: $color;
    display: flex;
    margin-bottom: 5px;
    padding: 1px 0px;
    .custom-checkbox-content {
      border: 1px solid $color;
    }
    .dropdown {
      position: relative;
      margin-right: 50px;
      .dropdown-title {
        display: flex;
        .dropdown-title-name {
          margin-right: 10px;
        }
        .dropdown-symbol {
          margin-top: 2px;
          height: 8px;
          width: 8px;
        }
      }
      .dropdown-list {
        position: absolute;
        background-color: white;
        border-radius: 5px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        top: 100%;
        left: 0px;
        width: 100%;
        display: none;
        padding: 9px;
        .dropdown-item + .dropdown-item {
          margin-top: 3px;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          .custom-checkbox {
            margin-right: 5px;
          }
        }
      }
      &:hover {
        .dropdown-list {
          display: inherit;
        }
      }
    }
    .direct-fly {
      display: flex;
      align-items: center;
      .custom-checkbox {
        margin-right: 5px;
      }
    }
  }
  .sell-block {
    display: flex;
    flex-direction: column;
    .header,
    .ticket {
      display: flex;
      align-items: flex-start;
      .column {
        padding-left: 10px;
      }
      .name {
        flex: 0 0 140px;
        max-width: 140px;
      }
      .type {
        flex: 0 0 110px;
      }
      .misc {
        flex: 0 0 150px;
      }
      .d-a-time {
        flex: 0 0 140px;
      }
      .buy-button {
        flex: 1 0;
      }
    }
    .header {
      color: white;
      background-color: #397fbf;
      padding: 5px 0px;
    }
    .tickets {
      .ticket + .ticket {
        border-top: 1px solid #dce6ea;
      }
      .ticket {
        background-color: white;
        padding: 15px 0px 25px;
        .name {
          display: flex;
          flex-direction: column;
          align-items: center;
          img + img {
            margin-top: 17px;
          }
          img {
            width: 70%;
          }
        }
        .misc {
          display: flex;
          flex-direction: column;
          font-size: 0.8em;
          color: #212c5b;
          .time-select {
            display: flex;
            .dropdown-symbol {
              margin-left: 5px; 
              margin-top: 3px;
              height: 4px;
              width: 4px;
              border-color: #55ABD4;
              border-width: 1.5px;
            }
          }
          .text {
            text-decoration-style: dotted;
            text-decoration-line: underline;
            text-decoration-color: #9ea3b7;
          }
        }
        .buy-button {
          display: flex;
          justify-content: flex-end;
          button {
            cursor: pointer;
            background-color: #fe9922;
            color: white;
            border: none;
            border-radius: 3px;
            padding: 10px 12px;
            margin-right: 15px;
          }
        }
        .d-a-time {
          display: flex;
          flex-direction: column;
          span + span {
            margin-top: 10px;
          }
        }
      }
    }
  }
}
</style>
