require 'rails_helper'
require_dependency 'discourse_version_check'

describe Admin::DashboardController do
  before do
    AdminDashboardData.stubs(:fetch_cached_stats).returns(reports: [])
    Jobs::VersionCheck.any_instance.stubs(:execute).returns(true)
  end

  it "is a subclass of AdminController" do
    expect(Admin::DashboardController < Admin::AdminController).to eq(true)
  end

  context 'while logged in as an admin' do
    let!(:admin) { log_in(:admin) }

    context '.index' do
      context 'version checking is enabled' do
        before do
          SiteSetting.version_checks = true
        end

        it 'returns discourse version info' do
          get :index, format: :json

          expect(response).to be_success
          json = JSON.parse(response.body)

          expect(json['dashboard']['version_check']).to be_present
        end
      end

      context 'version checking is disabled' do
        before do
          SiteSetting.version_checks = false
        end

        it 'does not return discourse version info' do
          get :index, format: :json
          json = JSON.parse(response.body)
          expect(json['dashboard']['version_check']).not_to be_present
        end
      end
    end

    context '.problems' do
      context 'when there are no problems' do
        before do
          AdminDashboardData.stubs(:fetch_problems).returns([])
        end

        it 'returns an empty array' do
          get :problems, format: :json

          expect(response).to be_success
          json = JSON.parse(response.body)
          expect(json['dashboard_problems'].size).to eq(0)
        end
      end

      context 'when there are problems' do
        before do
          AdminDashboardData.stubs(:fetch_problems).returns(['Not enough awesome', 'Too much sass'])
        end

        it 'returns an array of strings' do
          get :problems, format: :json
          expect(response).to be_success
          json = JSON.parse(response.body)
          expect(json['dashboard_problems'].size).to eq(2)
          expect(json['dashboard_problems'][0]['id']).to be_present
          expect(json['dashboard_problems'][0]['description']).to eq('Not enough awesome')
          expect(json['dashboard_problems'][1]['id']).to be_present
          expect(json['dashboard_problems'][1]['description']).to eq('Too much sass')
        end
      end
    end
  end

  context 'while logged in as a moderator' do
    let!(:mod) { log_in(:moderator) }

    it 'problems returns invalid access' do
      get :problems, format: :json
      expect(response).to_not be_success
    end
  end
end
