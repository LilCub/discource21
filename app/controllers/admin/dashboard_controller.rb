require 'disk_space'
class Admin::DashboardController < Admin::AdminController
  def index
    dashboard_data = AdminDashboardData.fetch_cached_stats || Jobs::DashboardStats.new.execute({})
    dashboard_data.merge!(version_check: DiscourseUpdates.check_version.as_json) if SiteSetting.version_checks?

    dashboard_data[:disk_space] = DiskSpace.cached_stats

    # Required for our REST serializer
    dashboard_data[:id] = 'dashboard'
    render json: { dashboard: dashboard_data }
  end

  def problems
    raise Discourse::InvalidAccess.new unless current_user.admin?

    render_json_dump(
      dashboard_problems: AdminDashboardData.fetch_problems.map do |p|
        { id: Digest::SHA1.hexdigest(p)[0..9], description: p }
      end
    )
  end
end
