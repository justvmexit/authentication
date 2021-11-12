#include <includes.hpp>

#pragma comment(lib, "libcurl.lib")

#define ENDPOINT "http://localhost:4000"
#define CURL_STATICLIB 

namespace auth
{
	enum status_e : std::uint32_t
	{
		undetected,
		detected
	};

	std::size_t write_function(void* data, std::size_t size, std::size_t nmemb, void* userdata);

	class secure_image
	{
	private:
		std::vector<std::uint32_t> image;
		std::uint32_t key;
	public:
		secure_image(std::vector<std::uint32_t> image);
		secure_image() {}

		~secure_image();

		std::vector<std::uint32_t> decrypt();

		auth::secure_image set_key(std::uint32_t key);
	};

	class session_ctx
	{
	private:
		std::string m_token;
	public:
		session_ctx(std::string token);
		session_ctx() {}

		~session_ctx();

		auth::secure_image stream();
	};

	class license_ctx
	{
	private:
		std::string m_id;
		std::string m_license;
		std::string m_hwid;
		std::string m_expiry;
		std::string m_created_on;
		std::uint32_t m_duration;
	public:
		license_ctx(std::string id, std::string license, std::string hwid, std::string expiry, std::string created_on, std::uint32_t duration);
		license_ctx() {}

		std::uint32_t deriveKey();

		~license_ctx();

		std::string id();

		std::string license();

		std::string hwid();

		std::string expiry();

		std::string created_on();
	};

	class variable_ctx
	{
	private:
		std::string m_id;
		std::string m_name;
		std::string m_content;
	public:
		variable_ctx(std::string id, std::string name, std::string content);
		variable_ctx() {}
		~variable_ctx();

		std::string id();

		std::string name();

		std::string content();
	};

	class app_ctx
	{
	private:
		std::string m_id;
		std::string m_name;
		std::string m_version; 
		std::string m_created_on;
		auth::status_e m_status;
	public:
		app_ctx(std::string id, std::string name, std::string version, auth::status_e status, std::string created_on); // i know this is ugly
		app_ctx() {}

		~app_ctx();

		auth::status_e status();

		std::string id();

		std::string name();

		std::string version();

		std::string created_on();
	};

	class response_ctx
	{
	private:
		auth::license_ctx m_license;
		auth::session_ctx m_session;
		auth::app_ctx m_app;
		bool m_success;
	public:
		response_ctx(auth::license_ctx license, auth::session_ctx session, auth::app_ctx app, bool success);
		response_ctx() {}

		auth::variable_ctx get_variable(std::string id);

		auth::license_ctx license();
		auth::session_ctx session();
		auth::app_ctx app();
		bool succeeded();
	};

	auth::response_ctx authenticate(std::string license);
}