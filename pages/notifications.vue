<template>
  <div class="row">
    <div class="col-md-6">
      <card>
        <h4 slot="header" class="card-title">Notificaciones entrantes</h4>

        <div v-for="support in supports" :key="support.id" icon="tim-icons icon-bell-55">
          <base-alert type="info" dismissible>
            <span><b>{{ support.Title }} - </b><br />
              {{ support.type }}
              <br />{{ support.description }}</span>
          </base-alert>
        </div>
      </card>
    </div>
    <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSeX9u0fxIp_Lm8B9rvEd49skT35P5WwE0k6E1hdEF-Jtat5_A/viewform?embedded=true" width="640" height="720" frameborder="0" marginheight="0" marginwidth="0">Cargando…</iframe>
  </div>
</template>
<script>
import { BaseAlert } from '@/components';
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.supabaseUrl;
const supabaseKey = process.env.supabaseKey;
const supabase = createClient(supabaseUrl, supabaseKey);


export default {
  name: 'notifications',
  components: {
    BaseAlert
  },
  data() {
    return {
      type: ['', 'info', 'success', 'warning', 'danger'],
      notifications: {
        topCenter: false
      },
      supports: []
    };
  },
  mounted() {
    const supports = supabase.channel('custom-insert-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'supports' },
        (payload) => {
          console.log('Change received!', payload)
          this.supports.push(payload.new)
          this.$notify({
            message: payload.Title,
            timeout: 30000,
            icon: 'tim-icons icon-bell-55',
          })
        }
      )
      .subscribe()
  },
  methods: {
  }
};
</script>
<style>
.card .alert {
  position: relative !important;
  width: 100%;
}
</style>
